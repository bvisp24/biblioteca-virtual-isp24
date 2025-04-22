const DATA_URL = "https://script.google.com/macros/s/AKfycbzVP2LlS79V7Dqmk33qG14LdPiuTPJO_4MPolLd6_VwRqca0tVffTZKmAoceMGxkb1a/exec";
let rawData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch(DATA_URL)
    .then(res => res.json())
    .then(data => {
      rawData = data;
      initializeFilters();
    })
    .catch(err => {
      console.error("Error al cargar datos:", err);
    });

  document.getElementById("filtro-carrera").addEventListener("change", handleCarreraChange);
  document.getElementById("filtro-ciclo").addEventListener("change", handleCicloChange);
  document.getElementById("filtro-anio").addEventListener("change", handleAnioChange);
  document.getElementById("filtro-materia").addEventListener("change", handleMateriaChange);
  document.getElementById("btn-buscar").addEventListener("click", handleNombreSearch);
});

function initializeFilters() {
  const carreras = [...new Set(rawData.map(item => item["Carrera"]).filter(Boolean))].sort();
  populateSelect("filtro-carrera", carreras);
}

function handleCarreraChange() {
  clearSelect("filtro-ciclo");
  clearSelect("filtro-anio");
  clearSelect("filtro-materia");
  clearResults();

  const selectedCarrera = this.value;
  if (!selectedCarrera) return;

  const ciclos = [...new Set(
    rawData
      .filter(item => item["Carrera"] === selectedCarrera)
      .map(item => item["Ciclo Lectivo"])
      .filter(Boolean)
  )].sort();

  populateSelect("filtro-ciclo", ciclos);
  showElement("filtro-ciclo");
}

function handleCicloChange() {
  clearSelect("filtro-anio");
  clearSelect("filtro-materia");
  clearResults();

  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = this.value;
  if (!carrera || !ciclo) return;

  const anios = [...new Set(
    rawData
      .filter(item => item["Carrera"] === carrera && item["Ciclo Lectivo"] === ciclo)
      .map(item => item["Año de Carrera"])
      .filter(Boolean)
  )].sort();

  populateSelect("filtro-anio", anios);
  showElement("filtro-anio");
}

function handleAnioChange() {
  clearSelect("filtro-materia");
  clearResults();

  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = document.getElementById("filtro-ciclo").value;
  const anio = this.value;
  if (!carrera || !ciclo || !anio) return;

  const materias = [...new Set(
    rawData
      .filter(item =>
        item["Carrera"] === carrera &&
        item["Ciclo Lectivo"] === ciclo &&
        item["Año de Carrera"] === anio
      )
      .map(item => item["Materia"])
      .filter(Boolean)
  )].sort();

  populateSelect("filtro-materia", materias);
  showElement("filtro-materia");
}

function handleMateriaChange() {
  clearResults();

  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = document.getElementById("filtro-ciclo").value;
  const anio = document.getElementById("filtro-anio").value;
  const materia = this.value;

  const resultados = rawData.filter(
    item =>
      item["Carrera"] === carrera &&
      item["Ciclo Lectivo"] === ciclo &&
      item["Año de Carrera"] === anio &&
      item["Materia"] === materia
  );

  mostrarResultados(resultados);
}

function populateSelect(id, opciones) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccionar uno";
  select.appendChild(defaultOption);

  opciones.forEach(op => {
    const option = document.createElement("option");
    option.value = op;
    option.textContent = op;
    select.appendChild(option);
  });
}

function showElement(id) {
  document.querySelector(`label[for="${id}"]`).style.display = "block";
  document.getElementById(id).style.display = "block";
}

function clearSelect(id) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  select.style.display = "none";
  const label = document.querySelector(`label[for="${id}"]`);
  if (label) label.style.display = "none";
}

function clearResults() {
  document.getElementById("resultados").innerHTML = "";
}

function mostrarResultados(data) {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No se encontraron archivos.</p>";
    return;
  }

  const cardsContainer = document.createElement("div");
  cardsContainer.className = "cards";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const h3 = document.createElement("h3");
    h3.textContent = item["Nombre del Archivo"];

    const link = document.createElement("a");
    link.href = item["URL"];
    link.target = "_blank";
    link.className = "btn";
    link.textContent = "Ver archivo PDF";

    card.appendChild(h3);
    card.appendChild(link);
    cardsContainer.appendChild(card);
  });

  container.appendChild(cardsContainer);
}

function handleNombreSearch() {
  const input = document.getElementById("busqueda-nombre");
  const searchTerm = input.value.trim().toLowerCase();
  clearResults();

  if (!searchTerm) return;

  const resultados = rawData.filter(item =>
    item["Nombre del Archivo"] &&
    item["Nombre del Archivo"].toLowerCase().includes(searchTerm)
  );

  if (resultados.length > 0) {
    mostrarResultados(resultados);
  } else {
    const container = document.getElementById("resultados");
    container.innerHTML = "<p>Su archivo no fue encontrado. Búsquelo de forma manual. Gracias.</p>";
  }
}
