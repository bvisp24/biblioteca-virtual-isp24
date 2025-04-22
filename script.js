const DATA_URL = "https://script.google.com/macros/s/AKfycbzVP2LlS79V7Dqmk33qG14LdPiuTPJO_4MPolLd6_VwRqca0tVffTZKmAoceMGxkb1a/exec";

let rawData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch(DATA_URL)
    .then(res => res.json())
    .then(data => {
      rawData = data.filter(row => row["Carrera"] && row["Ciclo lectivo"] && row["Año de carrera"] && row["Materia"]);
      initCarreraFilter();
    })
    .catch(err => {
      console.error("Error cargando datos:", err);
    });

  document.getElementById("filtro-carrera").addEventListener("change", handleCarrera);
  document.getElementById("filtro-ciclo").addEventListener("change", handleCiclo);
  document.getElementById("filtro-anio").addEventListener("change", handleAnio);
  document.getElementById("filtro-materia").addEventListener("change", handleMateria);
});

function uniqueValues(field, filter = () => true) {
  return [...new Set(rawData.filter(filter).map(item => item[field]))].sort();
}

function populateSelect(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  values.forEach(val => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
  select.style.display = "block";
  select.previousElementSibling.style.display = "block";
}

function initCarreraFilter() {
  const carreras = uniqueValues("Carrera");
  populateSelect("filtro-carrera", carreras);
}

function handleCarrera(e) {
  const selected = e.target.value;
  resetSelects(["filtro-ciclo", "filtro-anio", "filtro-materia"]);
  if (!selected) return;
  populateSelect("filtro-ciclo", uniqueValues("Ciclo lectivo", i => i["Carrera"] === selected));
}

function handleCiclo(e) {
  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = e.target.value;
  resetSelects(["filtro-anio", "filtro-materia"]);
  if (!carrera || !ciclo) return;
  populateSelect("filtro-anio", uniqueValues("Año de carrera", i => i["Carrera"] === carrera && i["Ciclo lectivo"] === ciclo));
}

function handleAnio(e) {
  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = document.getElementById("filtro-ciclo").value;
  const anio = e.target.value;
  resetSelects(["filtro-materia"]);
  if (!carrera || !ciclo || !anio) return;
  populateSelect("filtro-materia", uniqueValues("Materia", i => i["Carrera"] === carrera && i["Ciclo lectivo"] === ciclo && i["Año de carrera"] === anio));
}

function handleMateria(e) {
  const carrera = document.getElementById("filtro-carrera").value;
  const ciclo = document.getElementById("filtro-ciclo").value;
  const anio = document.getElementById("filtro-anio").value;
  const materia = e.target.value;

  const resultados = rawData.filter(i =>
    i["Carrera"] === carrera &&
    i["Ciclo lectivo"] === ciclo &&
    i["Año de carrera"] === anio &&
    i["Materia"] === materia
  );

  mostrarResultados(resultados);
}

function resetSelects(ids) {
  ids.forEach(id => {
    document.getElementById(id).innerHTML = '<option value="">Seleccionar uno</option>';
    document.getElementById(id).style.display = "none";
    document.getElementById(id).previousElementSibling.style.display = "none";
  });
  document.getElementById("resultados").innerHTML = "";
}

function mostrarResultados(data) {
  const contenedor = document.getElementById("resultados");
  contenedor.innerHTML = "";
  if (!data.length) {
    contenedor.innerHTML = "<p>No se encontraron archivos.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    const link = document.createElement("a");
    link.href = item["URL"];
    link.target = "_blank";
    link.textContent = item["Nombre de archivo"] || "Ver archivo";
    card.appendChild(link);
    contenedor.appendChild(card);
  });
}
