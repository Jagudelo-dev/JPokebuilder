// generateMoves.js - Genera js/movesData.js con todos los movimientos de la Gen 1 a la 9
const fs = require('fs');
const path = require('path');

async function fetchAllMoves() {
    const res = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
    const data = await res.json();
    const moves = {};

    for (const entry of data.results) {
        const detailRes = await fetch(entry.url);
        const move = await detailRes.json();

        const gen = parseInt(move.generation.url.split('/').slice(-2, -1)[0]);
        if (gen > 9) continue;

        const spanishName = move.names.find(n => n.language.name === 'es')?.name;
        if (!spanishName) continue;

        const category = move.damage_class?.name || 'status';
        moves[spanishName] = {
            type: translateType(move.type.name),
            power: move.power ?? 0,
            accuracy: move.accuracy ?? 0,
            pp: move.pp ?? 0,
            category: category === 'physical' ? 'Físico' : category === 'special' ? 'Especial' : 'Estado'
        };
    }
    return moves;
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
    const allMoves = await fetchAllMoves();
    const fileContent = `// js/movesData.js - Todos los movimientos (Gen 1-9) generado automáticamente
const MOVES = ${JSON.stringify(allMoves, null, 2)};`;

    const outputPath = path.join(__dirname, 'js', 'movesData.js');
    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(`✅ Archivo creado: ${outputPath} con ${Object.keys(allMoves).length} movimientos.`);
})();