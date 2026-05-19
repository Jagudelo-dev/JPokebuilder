// tools/generateMoves.js
// Genera js/data/moves.js y js/data/moves_en_es.json
const fs = require('fs');
const path = require('path');

async function fetchAllMoves() {
    const res = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
    const data = await res.json();
    const moves = {};
    const enToEs = {};

    for (const entry of data.results) {
        const detailRes = await fetch(entry.url);
        const move = await detailRes.json();

        const gen = parseInt(move.generation.url.split('/').slice(-2, -1)[0]);
        if (gen > 9) continue;

        const spanishName = move.names.find(n => n.language.name === 'es')?.name;
        const englishName = move.names.find(n => n.language.name === 'en')?.name;
        if (!spanishName || !englishName) continue;

        const category = move.damage_class?.name || 'status';

        moves[spanishName] = {
            type: translateType(move.type.name),
            power: move.power ?? 0,
            accuracy: move.accuracy ?? 0,
            pp: move.pp ?? 0,
            category: category === 'physical' ? 'Físico' : category === 'special' ? 'Especial' : 'Estado'
        };

        enToEs[englishName] = spanishName;
    }

    return { moves, enToEs };
}

function translateType(englishType) {
    const map = {
        normal: 'Normal', fire: 'Fuego', water: 'Agua', grass: 'Planta',
        electric: 'Eléctrico', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
        ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
        rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
        steel: 'Acero', fairy: 'Hada'
    };
    return map[englishType] || englishType;
}

(async () => {
    console.log('Descargando datos de la PokéAPI...');
    const { moves, enToEs } = await fetchAllMoves();

    // Guardar movimientos en español
    const movesContent = `// js/data/moves.js - Todos los movimientos (Gen 1-9) generado automáticamente
const MOVES = ${JSON.stringify(moves, null, 2)};`;
    fs.writeFileSync(path.join(__dirname, '..', 'js', 'data', 'moves.js'), movesContent, 'utf8');
    console.log(`✅ Movimientos guardados: ${Object.keys(moves).length}`);

    // Guardar mapeo inglés -> español
    fs.writeFileSync(path.join(__dirname, '..', 'js', 'data', 'moves_en_es.json'), JSON.stringify(enToEs, null, 2), 'utf8');
    console.log(`✅ Mapeo EN->ES guardado: ${Object.keys(enToEs).length} entradas.`);
})();