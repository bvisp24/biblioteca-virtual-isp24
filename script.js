const scriptURL = "https://script.google.com/macros/s/AKfycbwJxUVd3FUGs9vcAkVTgjlagtpGc8YRf0FMZFOICS1kWzHqEZc4bg5F7QFFq8VA_ice/exec";

let fullData = [];

async function fetchData() {
  try {
    const res = await fetch(scriptURL);
    fullData = await res.json();
    loadFilters();
    filterData();
  } catch (e) {
    console.error("Error al obtener datos:", e);
  }
}

function loadFilters() {
  const carrera = new Set();
  const ciclolectivo = new Set();
  const añocarrera = new Set();
  const materia = new Set();

  fullData.forEach(item => {
    carrera.add(item.Carrera);
    ciclolectivo.add(item["Ciclo Lectivo"]);
    añocarrera.add(item["Año Carrera"]);
    materia.add(item.Materia);
  });

  populateSelect("carrera", [...carrera]);
  populateSelect("ciclolectivo", [...ciclolectivo]);
  populateSelect("añocarrera", [...añocarrera]);
  populateSelect("materia", [...materia]);
}

function populateSelect(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Todos</option>';
  values.sort().forEach(val => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function filterData() {
  const c = document.getElementById("carrera").value;
  const cl = document.getElementById("ciclolectivo").value;
  const ac = document.getElementById("añocarrera").value;
  const m = document.getElementById("materia").value;

  const filtered = fullData.filter(item =>
    (c === "" || item.Carrera === c) &&
    (cl === "" || item["Ciclo Lectivo"] === cl) &&
    (ac === "" || item["Año Carrera"] === ac) &&
    (m === "" || item.Materia === m)
  );

  showFiles(filtered);
}

function showFiles(data) {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  if (data.length === 0) {
    fileList.innerHTML = "<p>No se encontraron archivos.</p>";
    return;
  }

  data.forEach(file => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>${file.Materia}</h4>
      <p><strong>Archivo:</strong> <a href="${file.Enlace}" target="_blank">${file.Archivo}</a></p>
      <p><strong>Año:</strong> ${file["Año Carrera"]} | <strong>Ciclo:</strong> ${file["Ciclo Lectivo"]}</p>
    `;

    fileList.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", fetchData);
