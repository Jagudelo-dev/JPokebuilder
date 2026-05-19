// main.js - Inicialización

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar la lista de Pokémon y popular POKEDEX global
    window.POKEDEX = {};
    try {
        const list = await getPokemonList();
        for (const name of list) {
            window.POKEDEX[name] = await fetchPokemonData(name);
        }
    } catch (err) {
        console.error('Error cargando datos de Pokémon:', err);
    }
    renderApp();
});