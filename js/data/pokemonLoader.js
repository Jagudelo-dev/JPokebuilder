// js/data/pokemonLoader.js - Carga dinámica de Pokémon desde JSON

let pokemonCache = {};
let pokemonIndex = null;

async function loadPokemonIndex() {
    if (pokemonIndex) return pokemonIndex;
    const res = await fetch('js/data/pokemon/index.json');
    pokemonIndex = await res.json();
    return pokemonIndex;
}

async function fetchPokemonData(name) {
    // Si ya está en caché, devolverlo
    if (pokemonCache[name]) return pokemonCache[name];
    
    const index = await loadPokemonIndex();
    const file = index[name];
    if (!file) throw new Error(`Pokémon "${name}" no encontrado en el índice.`);
    
    const res = await fetch(`js/data/pokemon/${file}`);
    const data = await res.json();
    pokemonCache[name] = data;
    return data;
}

async function getPokemonList() {
    const index = await loadPokemonIndex();
    return Object.keys(index);
}