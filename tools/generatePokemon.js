// tools/generatePokemon.js
// Genera js/data/pokemon/*.json y js/data/pokemon/index.json con movimientos en español
const fs = require('fs');
const path = require('path');

const MAX_POKEMON = 151;  // Cambia a 649 o el número que quieras
const TRANSLATION_MAP_PATH = path.join(__dirname, '..', 'js', 'data', 'moves_en_es.json');

// Cargar el diccionario inglés->español de movimientos
const enToEs = JSON.parse(fs.readFileSync(TRANSLATION_MAP_PATH, 'utf8'));

function translateMoveName(englishName) {
    // Primero intentamos con el nombre exacto
    if (enToEs[englishName]) return enToEs[englishName];
    // A veces la API devuelve nombres con guiones o capitalización distinta, normalizamos
    const normalized = englishName.toLowerCase().replace(/-/g, ' ');
    for (const [en, es] of Object.entries(enToEs)) {
        if (en.toLowerCase().replace(/-/g, ' ') === normalized) return es;
    }
    // Si no se encuentra, devolver el inglés (para no perderlo)
    return englishName;
}

async function fetchPokemon(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) return null;
    const data = await res.json();

    // Tipos en español
    const typeMap = {
        normal: 'Normal', fire: 'Fuego', water: 'Agua', grass: 'Planta',
        electric: 'Eléctrico', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
        ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
        rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
        steel: 'Acero', fairy: 'Hada'
    };
    const types = data.types.map(t => typeMap[t.type.name] || t.type.name);

    // Stats base
    const stats = {};
    data.stats.forEach(stat => {
        const name = stat.stat.name;
        if (name === 'hp') stats.hp = stat.base_stat;
        else if (name === 'attack') stats.atk = stat.base_stat;
        else if (name === 'defense') stats.def = stat.base_stat;
        else if (name === 'special-attack') stats.spa = stat.base_stat;
        else if (name === 'special-defense') stats.spd = stat.base_stat;
        else if (name === 'speed') stats.spe = stat.base_stat;
    });

    // Habilidades (primera, segunda y oculta)
    const abilities = [];
    data.abilities.forEach(ab => {
        const nameEs = translateAbility(ab.ability.name);
        if (!ab.is_hidden) abilities.push(nameEs);
    });
    const hiddenAbility = data.abilities.find(ab => ab.is_hidden);
    if (hiddenAbility) abilities.push(translateAbility(hiddenAbility.ability.name));

    // Movimientos por nivel
    const levelUpMoves = data.moves
        .filter(m => m.version_group_details.some(d => d.move_learn_method.name === 'level-up'))
        .map(m => {
            const details = m.version_group_details.find(d => d.move_learn_method.name === 'level-up');
            const level = details ? details.level_learned_at : 0;
            const moveName = translateMoveName(capitalizeMove(m.move.name));
            return { level, move: moveName };
        })
        .sort((a, b) => a.level - b.level);

    // Movimientos por TM (los que no son level-up)
    const tmMoves = data.moves
        .filter(m => !m.version_group_details.some(d => d.move_learn_method.name === 'level-up'))
        .map(m => translateMoveName(capitalizeMove(m.move.name)));

    // Movimientos huevo (no disponibles en esta API, se quedan vacíos)
    const eggMoves = [];

    // Nombre en español
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
    const nameEs = speciesData.names.find(n => n.language.name === 'es')?.name || capitalize(data.name);

    return {
        id: data.id,
        name: nameEs,
        types,
        baseStats: stats,
        abilities,
        learnset: {
            levelUp: levelUpMoves,
            egg: eggMoves,
            tm: tmMoves
        }
    };
}

function capitalizeMove(name) {
    // Capitalizar cada palabra y reemplazar guiones por espacios
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function translateAbility(englishName) {
    // Diccionario de habilidades comunes en español (puedes ampliarlo)
    const map = {
        'overgrow': 'Espesura',
        'blaze': 'Mar Llamas',
        'torrent': 'Torrente',
        'chlorophyll': 'Clorofila',
        'solar-power': 'Poder Solar',
        'rain-dish': 'Cura Lluvia',
        'static': 'Estática',
        'lightning-rod': 'Pararrayos',
        'motor-drive': 'Motor',
        'volt-absorb': 'Absorbe Electricidad',
        'intimidate': 'Intimidación',
        'swift-swim': 'Nado Rápido',
        'sand-stream': 'Chorro Arena',
        'drizzle': 'Llovizna',
        'drought': 'Sequía',
        'snow-warning': 'Nevada',
        'levitate': 'Levitación',
        'mold-breaker': 'Rompemoldes',
        'scrappy': 'Impasible',
        'sturdy': 'Robustez',
        'iron-fist': 'Puño Férreo',
        'guts': 'Agallas',
        'huge-power': 'Potencia',
        'magic-guard': 'Muro Mágico',
        'natural-cure': 'Cura Natural',
        'serene-grace': 'Dicha',
        'synchronize': 'Sincronía',
        'trace': 'Rastro',
        'pressure': 'Presión',
        'clear-body': 'Cuerpo Claro',
        'inner-focus': 'Foco Interno',
        'steadfast': 'Firmeza',
        'justified': 'Justiciero',
        'flash-fire': 'Absorbe Fuego',
        'water-absorb': 'Absorbe Agua',
        'volt-absorb': 'Absorbe Electricidad',
        'dry-skin': 'Piel Seca',
        'thick-fat': 'Sebo',
        'rock-head': 'Cabeza Roca',
        'stamina': 'Firmeza',
        'shed-skin': 'Mudar',
        'water-veil': 'Velo Agua',
        'limber': 'Flexibilidad',
        'insomnia': 'Insomnio',
        'vital-spirit': 'Espíritu Vital',
        'early-bird': 'Madrugar',
        'keen-eye': 'Vista Lince',
        'hyper-cutter': 'Mandíbula Fuerte',
        'sand-veil': 'Velo Arena',
        'swarm': 'Enjambre',
        'battle-armor': 'Armadura Batalla',
        'shell-armor': 'Armadura Concha',
        'cute-charm': 'Gran Encanto',
        'pickup': 'Recogida',
        'technician': 'Experto',
        'skill-link': 'Encadenado',
        'compound-eyes': 'Ojo Compuesto',
        'arena-trap': 'Arena Trampa',
        'shadow-tag': 'Paso Sombra',
        'wonder-guard': 'Superguarda',
        'magic-bounce': 'Espejo Mágico',
        'regenerator': 'Regeneración',
        'prankster': 'Bromista',
        'unaware': 'Ignorante',
        'poison-heal': 'Antídoto',
        'triage': 'Primer Auxilio',
        'moxie': 'Entusiasmo',
        'anger-point': 'Irascible',
        'no-guard': 'Indefenso',
        'adaptability': 'Adaptable',
        'download': 'Descarga',
        'protean': 'Cambio',
        'libero': 'Líbero',
        'tough-claws': 'Garras Duras',
        'aerilate': 'Piel Aérea',
        'pixilate': 'Piel Feérica',
        'refrigerate': 'Piel Fría',
        'galvanize': 'Piel Galvánica',
        'gale-wings': 'Alas Vendaval',
        'shadow-shield': 'Escudo Sombra',
        'full-metal-body': 'Cuerpo Metálico',
        'soul-heart': 'Corazón Alma',
        'beast-boost': 'Ultraimpulso',
        'power-construct': 'Construcción',
        'schooling': 'Cardumen',
        'shields-down': 'Escudo Despliegue',
        'disguise': 'Disfraz',
        'stance-change': 'Cambio Táctico',
        'multitype': 'Multitipo',
        'wimp-out': 'Salir Huyendo',
        'emergency-exit': 'Salida de Emergencia',
        'water-bubble': 'Burbuja de Agua',
        'steelworker': 'Forjador',
        'surge-surfer': 'Surfeador',
        'electric-surge': 'Electrogénesis',
        'psychic-surge': 'Psicogénesis',
        'grassy-surge': 'Herbogénesis',
        'misty-surge': 'Nebulogénesis',
        'dancer': 'Danza',
        'battery': 'Batería',
        'stamina': 'Firmeza',
        'corrosion': 'Corrosión',
        'slush-rush': 'Quitanieves',
        'tangling-hair': 'Maraña',
        'long-reach': 'Brazos Largos',
        'liquid-voice': 'Voz Líquida',
        'innards-out': 'Revísceras',
        'stakeout': 'Acecho',
        'power-of-alchemy': 'Alquimia',
        'receiver': 'Receptor',
        'rks-system': 'Sistema Alfa',
        'comatose': 'Letargo Perenne',
        'queenly-majesty': 'Regia Presencia',
        'dazzling': 'Deslumbrar',
        'neuroforce': 'Neurofuerza',
        'intrepid-sword': 'Espada Indómita',
        'dauntless-shield': 'Escudo Indómito',
        'unseen-fist': 'Puño Invisible',
        'quick-draw': 'Puntería Rápida',
        'curious-medicine': 'Medicina Curiosa',
        'transistor': 'Transistor',
        'dragons-maw': 'Mandíbula Dragón',
        'chilling-neigh': 'Relincho Gélido',
        'grim-neigh': 'Relincho Sombrío',
        'as-one': 'Unidad',
        'hunger-switch': 'Modo Hambre',
        'orichalcum-pulse': 'Pulso Oricalco',
        'hadron-engine': 'Motor Hadrónico',
        'quark-drive': 'Motor Quark',
        'protosynthesis': 'Fotosíntesis Primitiva',
        'zero-to-hero': 'De Cero a Héroe',
        'commander': 'Comandante',
        'opportunist': 'Oportunista',
        'wind-rider': 'Surcavientos',
        'thermal-exchange': 'Termointercambio',
        'purifying-salt': 'Sal Purificante',
        'well-baked-body': 'Cuerpo Cocido',
        'earth-eater': 'Geofagia',
        'mycelium-might': 'Poder Fúngico',
        'sharpness': 'Afilada',
        'supreme-overlord': 'Soberano Supremo',
        'costar': 'Coprotagonismo',
        'toxic-debris': 'Toxiescombros'
    };
    if (map[englishName]) return map[englishName];
    // Si no está en el mapa, devolver el nombre en inglés con la primera letra mayúscula
    return englishName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

(async () => {
    console.log(`Generando ${MAX_POKEMON} Pokémon...`);
    const index = {};
    for (let i = 1; i <= MAX_POKEMON; i++) {
        console.log(`Descargando #${i}...`);
        const data = await fetchPokemon(i);
        if (!data) continue;
        const filename = data.name.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '') + '.json';
        index[data.name] = filename;
        const outputPath = path.join(__dirname, '..', 'js', 'data', 'pokemon', filename);
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    }
    const indexPath = path.join(__dirname, '..', 'js', 'data', 'pokemon', 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
    console.log('✅ Todos los archivos generados correctamente.');
})();