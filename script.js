const DATA_URL = "https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/5";

let rawData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch(DATA_URL)
    .then((res) => res.json())
    .then((data) => {
      rawData = data;
      initCarrera();
    })
    .catch((error) => console.error("Error:", error));

  document.getElementById("filtro-carrera").addEventListener("change", handleCarrera);
  document.getElementById("filtro-ciclo").addEventListener("change", handleCiclo);
  document.getElementById("filtro-anio").addEventListener("change", handleAnio);
  document.getElementById("filtro-materia").addEventListener("change", handleMateria);
});

function initCarrera() {
  const carreras = [...new Set(rawData.map(item => item["Carrera"]).filter(Boolean))].sort();
  fillSelect("filtro-carrera", carreras);
}

function handleCarrera() {
  resetSelect("filtro-ciclo");
  resetSelect("filtro-anio");
  resetSelect("filtro-materia");
  clearResults();

  const carrera = this.value;
  if (!carrera) return;

  const ciclos = [...new Set(rawData.filter(item => item["Carrera"] === carrera).map(i => i["Ciclo lectivo"]).filter(Boolean))].sort();
  fillSelect("filtro-ciclo", ciclos);
  document.getElementById("grupo-ciclo").style.display = "block";
}

function handleCiclo() {
  resetSelect("filtro-anio");
  resetSelect("filtro-materia");
  clearResults();

  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = this.value;
  if (!carrera || !ciclo) return;

  const anios = [...new Set(rawData.filter(i => i["Carrera"] === carrera && i["Ciclo lectivo"] === ciclo).map(i => i["Año de carrera"]).filter(Boolean))].sort();
  fillSelect("filtro-anio", anios);
  document.getElementById("grupo-anio").style.display = "block";
}

function handleAnio() {
  resetSelect("filtro-materia");
  clearResults();

  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = document.getElementById("filtro-ciclo").value;
  const anio = this.value;
  if (!carrera || !ciclo || !anio) return;

  const materias = [...new Set(rawData.filter(i => i["Carrera"] === carrera && i["Ciclo lectivo"] === ciclo && i["Año de carrera"] === anio).map(i => i["Materia"]).filter(Boolean))].sort();
  fillSelect("filtro-materia", materias);
  document.getElementById("grupo-materia").style.display = "block";
}

function handleMateria() {
  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = document.getElementById("filtro-ciclo").value;
  const anio = document.getElementById("filtro-anio").value;
  const materia = this.value;

  const resultados = rawData.filter(
    i => i["Carrera"] === carrera &&
         i["Ciclo lectivo"] === ciclo &&
         i["Año de carrera"] === anio &&
         i["Materia"] === materia
  );

  showResults(resultados);
}

function fillSelect(id, opciones) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  opciones.forEach(op => {
    const option = document.createElement("option");
    option.value = op;
    option.textContent = op;
    select.appendChild(option);
  });
}

function resetSelect(id) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  select.parentElement.style.display = "none";
}

function clearResults() {
  document.getElementById("resultados").innerHTML = "";
}

function showResults(data) {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No se encontraron archivos.</p>";
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "resultado";
    div.innerHTML = `<a href="${item["URL"]}" target="_blank" rel="noopener noreferrer">
      <img src="img/pdf-icon.png" class="pdf-icon" alt="PDF" />
      ${item["Nombre de archivo"]}
    </a>`;
    container.appendChild(div);
  });
}
