const typeColorsMapping = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dark: '#705848',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878'
};


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

    const pokemonsBlock = document.createElement('div');
    pokemonsBlock.className = 'pokemons-cards-block';

    document.body.appendChild(pokemonsBlock);

    let pokemons = await getPokemons(1);
    const promises = pokemons.map(getPokemonInfo)
    const pokemonsInfo = await Promise.all(promises);
    pokemonsInfo.forEach(pokemonInfo => displayPokemon(pokemonInfo, pokemonsBlock));
}

const displayPokemon = (pokemon_info, pokemonsBlock) => {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const name = document.createElement('h2');
    name.textContent = pokemon_info.name;

    const img = document.createElement('img');
    img.src = pokemon_info.sprites.front_default;
    img.alt = pokemon_info.name;
    img.className = 'pokemon-icon';

    const mainType = pokemon_info.types[0].type.name;
    card.style.backgroundColor = typeColorsMapping[mainType] || '#f8f8f8d3';

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

    pokemonsBlock.appendChild(card);

    // document.body.appendChild(card);

}

main();