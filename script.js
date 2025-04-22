const API_URL = "https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/3";
let allData = [];

window.onload = async () => {
  const response = await fetch(API_URL);
  allData = await response.json();

  const carreraSelect = document.getElementById("carrera");
  const cicloSelect = document.getElementById("ciclo");
  const anioSelect = document.getElementById("anio");
  const materiaSelect = document.getElementById("materia");

  fillOptions(carreraSelect, getUnique(allData, "Carrera"));

  carreraSelect.addEventListener("change", () => {
    const filtered = allData.filter(d => d.Carrera === carreraSelect.value);
    fillOptions(cicloSelect, getUnique(filtered, "Ciclo Lectivo"));
    cicloSelect.disabled = false;
    anioSelect.innerHTML = `<option value="">Seleccionar uno</option>`;
    materiaSelect.innerHTML = `<option value="">Seleccionar uno</option>`;
    anioSelect.disabled = true;
    materiaSelect.disabled = true;
    renderResults([]);
  });

  cicloSelect.addEventListener("change", () => {
    const filtered = allData.filter(d =>
      d.Carrera === carreraSelect.value &&
      d["Ciclo Lectivo"] === cicloSelect.value
    );
    fillOptions(anioSelect, getUnique(filtered, "Año de Carrera"));
    anioSelect.disabled = false;
    materiaSelect.innerHTML = `<option value="">Seleccionar uno</option>`;
    materiaSelect.disabled = true;
    renderResults([]);
  });

  anioSelect.addEventListener("change", () => {
    const filtered = allData.filter(d =>
      d.Carrera === carreraSelect.value &&
      d["Ciclo Lectivo"] === cicloSelect.value &&
      d["Año de Carrera"] === anioSelect.value
    );
    fillOptions(materiaSelect, getUnique(filtered, "Materia"));
    materiaSelect.disabled = false;
    renderResults([]);
  });

  materiaSelect.addEventListener("change", () => {
    const filtered = allData.filter(d =>
      d.Carrera === carreraSelect.value &&
      d["Ciclo Lectivo"] === cicloSelect.value &&
      d["Año de Carrera"] === anioSelect.value &&
      d["Materia"] === materiaSelect.value
    );
    renderResults(filtered);
  });
};

function getUnique(data, key) {
  return [...new Set(data.map(d => d[key]).filter(Boolean))];
}

function fillOptions(select, options) {
  select.innerHTML = `<option value="">Seleccionar uno</option>` +
    options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
}

function renderResults(data) {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No se encontraron archivos.</p>";
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "result-item";

    div.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF">
      <a href="${item.URL}" target="_blank">${item["Nombre de Archivo"]}</a>
    `;

    container.appendChild(div);
  });
}
