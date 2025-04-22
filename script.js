const endpoint = "https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/2";

let data = [];

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(endpoint);
  data = await res.json();

  populateDropdown("carrera", [...new Set(data.map(item => item["Carrera"]))]);

  document.getElementById("carrera").addEventListener("change", handleFilter);
  document.getElementById("ciclolectivo").addEventListener("change", handleFilter);
  document.getElementById("añocarrera").addEventListener("change", handleFilter);
  document.getElementById("materia").addEventListener("change", handleFilter);
});

function populateDropdown(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  options.filter(o => o).forEach(option => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    select.appendChild(opt);
  });
  select.disabled = false;
}

function handleFilter() {
  const carrera = document.getElementById("carrera").value;
  const ciclo = document.getElementById("ciclolectivo").value;
  const año = document.getElementById("añocarrera").value;
  const materia = document.getElementById("materia").value;

  let filtered = data;

  if (carrera) {
    filtered = filtered.filter(item => item["Carrera"] === carrera);
    populateDropdown("ciclolectivo", [...new Set(filtered.map(item => item["Ciclo Lectivo"]))]);
  }

  if (ciclo) {
    filtered = filtered.filter(item => item["Ciclo Lectivo"] === ciclo);
    populateDropdown("añocarrera", [...new Set(filtered.map(item => item["Año de Carrera"]))]);
  }

  if (año) {
    filtered = filtered.filter(item => item["Año de Carrera"] === año);
    populateDropdown("materia", [...new Set(filtered.map(item => item["Materia"]))]);
  }

  if (materia) {
    filtered = filtered.filter(item => item["Materia"] === materia);
  }

  showResults(filtered);
}

function showResults(items) {
  const container = document.getElementById("fileList");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const link = document.createElement("a");
    link.href = item["URL"];
    link.target = "_blank";
    link.textContent = item["Nombre de Archivo"];

    card.appendChild(link);
    container.appendChild(card);
  });
}
