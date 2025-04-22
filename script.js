const url = "https://script.google.com/macros/s/AKfycbwJxUVd3FUGs9vcAkVTgjlagtpGc8YRf0FMZFOICS1kWzHqEZc4bg5F7QFFq8VA_ice/exec";

let data = [];

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(url);
  data = await res.json();
  populateCarrera();
});

function uniqueOptions(columnName, filter = {}) {
  const filtered = data.filter(item => {
    return Object.entries(filter).every(([key, val]) => !val || item[key] === val);
  });
  return [...new Set(filtered.map(item => item[columnName]))].sort();
}

function populateSelect(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  values.forEach(val => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
  select.disabled = false;
}

function populateCarrera() {
  const carreras = uniqueOptions("Carrera");
  populateSelect("carrera", carreras);
}

document.getElementById("carrera").addEventListener("change", () => {
  const carrera = document.getElementById("carrera").value;
  populateSelect("ciclo", uniqueOptions("Ciclo Lectivo", { "Carrera": carrera }));
  document.getElementById("anio").disabled = true;
  document.getElementById("materia").disabled = true;
  document.getElementById("resultados").innerHTML = "";
});

document.getElementById("ciclo").addEventListener("change", () => {
  const carrera = document.getElementById("carrera").value;
  const ciclo = document.getElementById("ciclo").value;
  populateSelect("anio", uniqueOptions("Año de Carrera", { "Carrera": carrera, "Ciclo Lectivo": ciclo }));
  document.getElementById("materia").disabled = true;
  document.getElementById("resultados").innerHTML = "";
});

document.getElementById("anio").addEventListener("change", () => {
  const carrera = document.getElementById("carrera").value;
  const ciclo = document.getElementById("ciclo").value;
  const anio = document.getElementById("anio").value;
  populateSelect("materia", uniqueOptions("Materia", {
    "Carrera": carrera,
    "Ciclo Lectivo": ciclo,
    "Año de Carrera": anio
  }));
  document.getElementById("resultados").innerHTML = "";
});

document.getElementById("materia").addEventListener("change", () => {
  const carrera = document.getElementById("carrera").value;
  const ciclo = document.getElementById("ciclo").value;
  const anio = document.getElementById("anio").value;
  const materia = document.getElementById("materia").value;

  const resultados = data.filter(item =>
    item["Carrera"] === carrera &&
    item["Ciclo Lectivo"] === ciclo &&
    item["Año de Carrera"] === anio &&
    item["Materia"] === materia
  );

  const contenedor = document.getElementById("resultados");
  contenedor.innerHTML = resultados.map(item => `
    <div class="card">
      <a href="${item["URL"]}" target="_blank">${item["Nombre de Archivo"]}</a>
    </div>
  `).join("");
});
