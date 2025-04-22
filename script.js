const API_URL = "https://script.google.com/macros/s/AKfycbwJxUVd3FUGs9vcAkVTgjlagtpGc8YRf0FMZFOICS1kWzHqEZc4bg5F7QFFq8VA_ice/exec";

let allData = [];

async function fetchData() {
  const res = await fetch(API_URL);
  const json = await res.json();
  allData = json;
  populateFilters();
  filterData(); // Mostrar todo al inicio
}

function populateFilters() {
  const carreraSelect = document.getElementById("carrera");
  const ciclolectivoSelect = document.getElementById("ciclolectivo");
  const añocarreraSelect = document.getElementById("añocarrera");
  const materiaSelect = document.getElementById("materia");

  const carreras = [...new Set(allData.map(row => row.Carrera))];
  const ciclos = [...new Set(allData.map(row => row.CicloLectivo))];
  const años = [...new Set(allData.map(row => row.Año))];
  const materias = [...new Set(allData.map(row => row.Materia))];

  [carreraSelect, ciclolectivoSelect, añocarreraSelect, materiaSelect].forEach(select => select.innerHTML = "<option value=''>Todos</option>");

  carreras.forEach(c => carreraSelect.innerHTML += `<option value="${c}">${c}</option>`);
  ciclos.forEach(c => ciclolectivoSelect.innerHTML += `<option value="${c}">${c}</option>`);
  años.forEach(a => añocarreraSelect.innerHTML += `<option value="${a}">${a}</option>`);
  materias.forEach(m => materiaSelect.innerHTML += `<option value="${m}">${m}</option>`);
}

function filterData() {
  const carrera = document.getElementById("carrera").value;
  const ciclo = document.getElementById("ciclolectivo").value;
  const año = document.getElementById("añocarrera").value;
  const materia = document.getElementById("materia").value;

  const results = allData.filter(row => {
    return (!carrera || row.Carrera === carrera)
        && (!ciclo || row.CicloLectivo === ciclo)
        && (!año || row.Año === año)
        && (!materia || row.Materia === materia);
  });

  showResults(results);
}

function showResults(data) {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  if (data.length === 0) {
    fileList.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${item.Materia}</strong>
      <p><b>Carrera:</b> ${item.Carrera}</p>
      <p><b>Ciclo:</b> ${item.CicloLectivo}</p>
      <p><b>Año:</b> ${item.Año}</p>
      <p><a href="${item.URL}" target="_blank">📄 Ver archivo</a></p>
    `;
    fileList.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", fetchData);
