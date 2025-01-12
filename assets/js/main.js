const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemon = document.getElementById('pokemon')
const modal = document.getElementById('modal')

const maxRecords = 151;
const limit = 5;
let offset = 0;

function loadPokemonItens(offset, limit) {

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li id="pokemon" class="pokemon ${pokemon.type}"
                data-pokemon='${JSON.stringify(pokemon)}'>
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
            `
        ).join('')

        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordWithNextPage = offset + limit

    if(qtdRecordWithNextPage >= maxRecords){
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

pokemonList.addEventListener("click", (event) => {
    const pokemonElement = event.target.closest("#pokemon");

    if (pokemonElement) {
        const pokemonData = JSON.parse(pokemonElement.dataset.pokemon);
        const modal = createPokemonModal(pokemonData);
        showModal(modal);
        addModalCloseEvent(modal);
    }
});

function createPokemonModal(pokemonData) {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <div class="pokemon pokemon-modal ${pokemonData.type}">
                <div class="close-modal">
                    <span class="number number-modal">#${pokemonData.number}</span>
                    <button>x</button>
                </div>
                <span class="name name-modal">${pokemonData.name}</span>
                <ol class="types types-modal">
                    ${pokemonData.types.map((type) => `<li class="type ${type} type-modal">${type}</li>`).join('')}
                </ol>
                <img src="${pokemonData.photo}" alt="${pokemonData.name}">
            </div>
            <div class="modal-description">
                <table>
                    <tr>
                        <th>Height</th>
                        <td>${pokemonData.height}</td>
                    </tr>
                    <tr>
                        <th>Weight</th>
                        <td>${pokemonData.weight}</td>
                    </tr>
                    <tr>
                        <th>Experience</th>
                        <td>${pokemonData.experience}</td>
                    </tr>
                    <tr>
                        <th>Abilities</th>
                        <td>${pokemonData.abilities.join(', ')}</td>
                    </tr>
                </table>
            </div>
        </div>
    `;
    return modal;
}

function showModal(modal) {
    document.body.appendChild(modal);
    modal.style.display = "flex";
}

function addModalCloseEvent(modal) {
    function closeModalOnClickOutside(event) {
        if (event.target === modal) {
            modal.remove();
            window.removeEventListener("click", closeModalOnClickOutside);
        }
    }

    window.addEventListener("click", closeModalOnClickOutside);

    const closeButton = modal.querySelector(".close-modal button");
    if (closeButton) {
        closeButton.addEventListener("click", (event) => {
            event.stopPropagation();
            modal.remove();
            window.removeEventListener("click", closeModalOnClickOutside);
        });
    }
}