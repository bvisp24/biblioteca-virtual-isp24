const DATA_URL = "https://script.google.com/macros/s/AKfycbwJxUVd3FUGs9vcAkVTgjlagtpGc8YRf0FMZFOICS1kWzHqEZc4bg5F7QFFq8VA_ice/exec";

let allData = [];

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(DATA_URL);
  const data = await response.json();
  allData = data;

  populateFilters();
  filterData();
});

function populateFilters() {
  const carreraSet = new Set();
  const cicloSet = new Set();
  const añoSet = new Set();
  const materiaSet = new Set();

  allData.forEach(row => {
    carreraSet.add(row["Carrera"]);
    cicloSet.add(row["Ciclo Lectivo"]);
    añoSet.add(row["Año"]);
    materiaSet.add(row["Materia"]);
  });

  fillSelect("carrera", carreraSet);
  fillSelect("ciclolectivo", cicloSet);
  fillSelect("añocarrera", añoSet);
  fillSelect("materia", materiaSet);
}

function fillSelect(id, set) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">-- Todos --</option>';
  Array.from(set).sort().forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function filterData() {
  const carrera = document.getElementById("carrera").value;
  const ciclo = document.getElementById("ciclolectivo").value;
  const año = document.getElementById("añocarrera").value;
  const materia = document.getElementById("materia").value;

  const filtered = allData.filter(row => {
    return (!carrera || row["Carrera"] === carrera) &&
           (!ciclo || row["Ciclo Lectivo"] === ciclo) &&
           (!año || row["Año"] === año) &&
           (!materia || row["Materia"] === materia);
  });

  displayFiles(filtered);
}

function displayFiles(data) {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  if (data.length === 0) {
    fileList.innerHTML = "<p>No se encontraron archivos.</p>";
    return;
  }

  data.forEach(row => {
    const card = document.createElement("div");
    card.className = "card";
    const link = document.createElement("a");
    link.href = row["Archivo"];
    link.target = "_blank";
    link.textContent = row["Archivo"].split("/").pop(); // nombre del archivo
    card.appendChild(link);
    fileList.appendChild(card);
  });
}
