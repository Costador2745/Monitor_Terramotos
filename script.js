let todosTerramotos = [];

async function carregarTerramotos() 
{
  const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
  const listaDiv = document.getElementById("lista");
  listaDiv.innerHTML = "🔎 A carregar...";

  try 
  {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    todosTerramotos = dados.features;
    document.getElementById("contador").textContent = "Total de terramotos: " + todosTerramotos.length;

    renderizarTerramotos();
  } 
  catch (erro) 
  {
    listaDiv.innerHTML = "Erro ao carregar dados, tente novamente.";
    console.error(erro);
  }
}

function renderizarTerramotos() 
{
  const listaDiv = document.getElementById("lista");
  listaDiv.innerHTML = "";

  const minMagnitude = parseFloat(document.getElementById("filtroMagnitude").value);
  const termoPesquisa = document.getElementById("pesquisaLocal").value.toLowerCase();
  const ordenarPor = document.getElementById("ordenarPor").value;

let filtrados = todosTerramotos.filter(function(eq) 
{
  return eq.properties.mag >= minMagnitude && eq.properties.place.toLowerCase().includes(termoPesquisa);
});

if (ordenarPor === "data") 
{
  filtrados.sort(function(a, b) 
  {
    return b.properties.time - a.properties.time;
  });
} 
else if (ordenarPor === "magnitude") 
{
  filtrados.sort(function(a, b) 
  {
    return b.properties.mag - a.properties.mag;
  });
}

  filtrados.forEach(function(eq) 
  {
    const props = eq.properties;
    const magnitude = props.mag;
    const local = props.place;
    const data = tempoRelativo(props.time);
    const link = props.url;

    let gravidade;

    if (magnitude < 3)
      gravidade = "leve";
    else if (magnitude <= 5) 
      gravidade = "moderado";
    else 
      gravidade = "forte";


    const div = document.createElement("div");
    div.className = "terramoto " + gravidade;
    div.innerHTML = 
      `<strong>${local}</strong><br>
      Magnitude: ${magnitude}<br>
      Data/hora: ${data}<br>
      <a href="${link}" target="_blank">Mais detalhes</a>`;
    
    listaDiv.appendChild(div);
  });
  }

  function tempoRelativo(tempo) 
  {
    const agora = Date.now();
    const diferenca = agora - tempo;
    const segundos = Math.floor(diferenca / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

  if (segundos < 60) 
    return `há ${segundos} segundos`;
  else if (minutos < 60) 
    return `há ${minutos} minutos`;
  else if (horas < 24) 
    return `há ${horas} horas`;
  else
    return `há ${dias} dia${dias > 1 ? "s" : ""}`;
  }

  // Event listeners para filtros
  document.getElementById("filtroMagnitude").addEventListener("input", function() 
  {
    document.getElementById("valorMagnitude").textContent = this.value;
    renderizarTerramotos();
  });

document.getElementById("pesquisaLocal").addEventListener("input", renderizarTerramotos);
document.getElementById("ordenarPor").addEventListener("change", renderizarTerramotos);

// Atualiza automaticamente a cada 60 segundos
setInterval(() => {
  carregarTerramotos();
}, 60000);

// Carregamento inicial
carregarTerramotos();
