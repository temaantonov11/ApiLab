
const POKEMONS_API_URL = "https://pokeapi.co/api/v2";

const getPokemons = async (limit) => {
    const response = await fetch(`${POKEMONS_API_URL}/pokemon?limit=${limit}`);
    const pokemons = await response.json();
    return pokemons.results;
}

const getPokemonInfo = async (pokemon) => {
    const response = await fetch(pokemon.url);
    const pokemon_info = await response.json();
    return pokemon_info;
}

const main = async () => {
    let pokemons = await getPokemons(300);
    for (const pokemon of pokemons) {
        const pokemon_info = await getPokemonInfo(pokemon);
        displayPokemon(pokemon_info);
    }


}

const displayPokemon = (pokemon_info) => {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const name = document.createElement('h2');
    name.textContent = pokemon_info.name;

    const img = document.createElement('img');
    img.src = pokemon_info.sprites.front_default;
    img.alt = pokemon_info.name;
    img.className = 'pokemon-icon';

    const types = document.createElement('p');
    types.textContent = 'Type: ' + pokemon_info.types.map(t => t.type.name).join(', ');

    const abilities = document.createElement('p');
    abilities.textContent = 'Abilities: ' + pokemon_info.abilities.map(a => a.ability.name).join(', ');

    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats';

    pokemon_info.stats.forEach(stat => {
        const statRow = document.createElement('div');
        statRow.className = 'stat-row';

        const statName = document.createElement('span');
        statName.textContent = stat.stat.name;

        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';

        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.style.width = stat.base_stat + 'px';
        statValue.textContent = stat.base_stat;

        statBar.appendChild(statValue);
        statRow.append(statName, statBar);
        statsContainer.appendChild(statRow);

    });

    card.append(name, img, types, abilities, statsContainer);
    document.body.appendChild(card);

}

main();
