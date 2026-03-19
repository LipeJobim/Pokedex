const pokedex = document.getElementById("pokedex")
//const modal = document.getElementById("modal")
//const modalContent = document.getElementById("modalContent")

//cores por tipo
const cores = {
  fire: "#ff6b6b",
  water: "#4dabf7",
  grass: "#51cf66",
  electric: "#ffd43b",
  bug: "#94d82d",
  normal: "#adb5bd",
  poison: "#b197fc",
  ground: "#e9c46a",
  fairy: "#ffafcc",
  steel: "#868e96",    
  dragon: "#7048e8",
  psychic: "#f06595",   
  fighting: "#c92a2a",  
  dark: "#343a40",
  ice: "#74c0fc",
  rock: "#a68a64",
  ghost: "#5f3dc4",
  flying: "#91a7ff"
}

//carregar por região
async function carregarRegiao(gen, tema) {

  document.body.className = tema
  pokedex.innerHTML = "Carregando..."

  let res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`)
  let data = await res.json()

  let lista = data.pokemon_species

  lista.sort((a, b) => pegarId(a.url) - pegarId(b.url))

  pokedex.innerHTML = ""

  for (let p of lista) {

    let id = pegarId(p.url)

    let resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    let poke = await resPoke.json()

    let tipos = poke.types.map(t => t.type.name)

    let cor = cores[tipos[0]] || "#ccc"

    let card = document.createElement("div")
    card.classList.add("card")

    card.style.borderTop = `5px solid ${cor}`

    card.innerHTML = `
      <img src="${poke.sprites.front_default}">
      <p>#${id.toString().padStart(3, '0')}</p>
      <h3>${formatarNome(poke.name)}</h3>
   <small>
  ${tipos.map(t => `<span class="tipo ${t}">${formatarNome(t)}</span>`).join("")}
</small>
    `

    card.onclick = () => abrirModal(poke)

    pokedex.appendChild(card)
  }
}
function formatarNome(nome) {
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}
//modal
function abrirModal(p) {

  modalContent.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.sprites.front_default}">
    
    <p><b>ID:</b> ${p.id}</p>
    <p><b>Altura:</b> ${p.height}</p>
    <p><b>Peso:</b> ${p.weight}</p>
    <p><b>Tipos:</b> ${p.types.map(t => t.type.name).join(", ")}</p>

    <h4>Status:</h4>
    ${p.stats.map(s => `<p>${s.stat.name}: ${s.base_stat}</p>`).join("")}

    <button onclick="fecharModal()">Fechar</button>
  `

  modal.classList.remove("hidden")
}

function fecharModal() {
  modal.classList.add("hidden")
}

function pegarId(url) {
  return url.split("/").filter(Boolean).pop()
}
document.getElementById("search").addEventListener("input", function(e) {
  let nome = e.target.value.toLowerCase()
  let cards = document.querySelectorAll(".card")

  cards.forEach(card => {
    let texto = card.innerText.toLowerCase()
    card.style.display = texto.includes(nome) ? "block" : "none"
  })
})


//inicia com Kanto
carregarRegiao(1, "kanto")