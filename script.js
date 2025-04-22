const DATA_URL = "https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/5";

let rawData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch(DATA_URL)
    .then((res) => res.json())
    .then((data) => {
      rawData = data;
      initializeFilters();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  document.getElementById("filtro-carrera").addEventListener("change", handleCarreraChange);
  document.getElementById("filtro-ciclo").addEventListener("change", handleCicloChange);
  document.getElementById("filtro-anio").addEventListener("change", handleAnioChange);
  document.getElementById("filtro-materia").addEventListener("change", handleMateriaChange);
});

function initializeFilters() {
  const container = document.getElementById("filtro-carrera").parentElement;
  const label = document.createElement("label");
  label.textContent = "Filtro: Seleccione su carrera para continuar";
  label.style.display = "block";
  label.style.fontWeight = "bold";
  label.style.textAlign = "center";
  label.style.marginBottom = "10px";
  container.insertBefore(label, document.getElementById("filtro-carrera"));

  const carreras = [...new Set(rawData.map(item => item["Carrera"]).filter(Boolean))].sort();
  populateSelect("filtro-carrera", carreras);
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
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
      .map(item => item["Ciclo lectivo"])
      .filter(Boolean)
  )].sort();

  populateSelect("filtro-ciclo", ciclos);
  document.getElementById("filtro-ciclo").parentElement.style.display = "block";
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
      .filter(item => item["Carrera"] === carrera && item["Ciclo lectivo"] === ciclo)
      .map(item => item["Año de carrera"])
      .filter(Boolean)
  )].sort();

  populateSelect("filtro-anio", anios);
  document.getElementById("filtro-anio").parentElement.style.display = "block";
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
      .filter(item => item["Carrera"] === carrera && item["Ciclo lectivo"] === ciclo && item["Año de carrera"] === anio)
      .map(item => item["Materia"])
      .filter(Boolean)
  )].sort();

  populateSelect("filtro-materia", materias);
  document.getElementById("filtro-materia").parentElement.style.display = "block";
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
      item["Ciclo lectivo"] === ciclo &&
      item["Año de carrera"] === anio &&
      item["Materia"] === materia
  );

  mostrarResultados(resultados);
}

function populateSelect(id, opciones) {
  const select = document.getElementById(id);
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccionar uno";
  select.appendChild(defaultOption);

  opciones.forEach(opcion => {
    const option = document.createElement("option");
    option.value = opcion;
    option.textContent = opcion;
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
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No se encontraron archivos.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("resultado");

    const link = document.createElement("a");
    link.href = item["URL"];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = `<img src="img/pdf-icon.png" alt="PDF" class="pdf-icon" /> ${item["Nombre de archivo"]}`;

    card.appendChild(link);
    container.appendChild(card);
  });
}
