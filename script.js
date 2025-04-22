const DATA_URL = "https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/5";
let rawData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch(DATA_URL)
    .then(res => res.json())
    .then(data => {
      rawData = data;
      populateCarreras();
    })
    .catch(error => console.error("Error al cargar datos:", error));

  document.getElementById("filtro-carrera").addEventListener("change", handleCarrera);
  document.getElementById("filtro-ciclo").addEventListener("change", handleCiclo);
  document.getElementById("filtro-anio").addEventListener("change", handleAnio);
  document.getElementById("filtro-materia").addEventListener("change", handleMateria);
});

function populateCarreras() {
  const carreras = [...new Set(rawData.map(i => i["Carrera"]).filter(Boolean))].sort();
  setOptions("filtro-carrera", carreras);
}

function handleCarrera() {
  clearSelect("filtro-ciclo");
  clearSelect("filtro-anio");
  clearSelect("filtro-materia");
  clearResults();

  const val = this.value;
  if (!val) return;

  const ciclos = [...new Set(rawData.filter(i => i["Carrera"] === val).map(i => i["Ciclo lectivo"]).filter(Boolean))].sort();
  setOptions("filtro-ciclo", ciclos);
  document.getElementById("filtro-ciclo").parentElement.style.display = "block";
}

function handleCiclo() {
  clearSelect("filtro-anio");
  clearSelect("filtro-materia");
  clearResults();

  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = this.value;
  if (!carrera || !ciclo) return;

  const anios = [...new Set(rawData.filter(i => i["Carrera"] === carrera && i["Ciclo lectivo"] === ciclo).map(i => i["Año de carrera"]).filter(Boolean))].sort();
  setOptions("filtro-anio", anios);
  document.getElementById("filtro-anio").parentElement.style.display = "block";
}

function handleAnio() {
  clearSelect("filtro-materia");
  clearResults();

  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = document.getElementById("filtro-ciclo").value;
  const anio = this.value;
  if (!carrera || !ciclo || !anio) return;

  const materias = [...new Set(rawData.filter(i => i["Carrera"] === carrera && i["Ciclo lectivo"] === ciclo && i["Año de carrera"] === anio).map(i => i["Materia"]).filter(Boolean))].sort();
  setOptions("filtro-materia", materias);
  document.getElementById("filtro-materia").parentElement.style.display = "block";
}

function handleMateria() {
  clearResults();

  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = document.getElementById("filtro-ciclo").value;
  const anio = document.getElementById("filtro-anio").value;
  const materia = this.value;

  const resultados = rawData.filter(i =>
    i["Carrera"] === carrera &&
    i["Ciclo lectivo"] === ciclo &&
    i["Año de carrera"] === anio &&
    i["Materia"] === materia
  );

  mostrarResultados(resultados);
}

function setOptions(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  values.forEach(val => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function clearSelect(id) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  select.parentElement.style.display = "none";
}

function clearResults() {
  document.getElementById("resultados").innerHTML = "";
}

function mostrarResultados(data) {
  const cont = document.getElementById("resultados");
  if (data.length === 0) {
    cont.innerHTML = "<p>No se encontraron archivos.</p>";
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "resultado";

    const link = document.createElement("a");
    link.href = item["URL"];
    link.target = "_blank";
    link.innerHTML = `<img src="img/pdf-icon.png" alt="PDF"> ${item["Nombre de archivo"]}`;

    div.appendChild(link);
    cont.appendChild(div);
  });
}
