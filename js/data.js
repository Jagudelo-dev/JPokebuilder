// data.js - Base de datos del Team Builder (Gen V)
// Datos de ejemplo. Amplía con todos los Pokémon y movimientos reales.

const POKEDEX = {
    "Bulbasaur": {
        id: 1,
        types: ["Planta", "Veneno"],
        baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
        abilities: ["Espesura", "Clorofila"],
        learnset: {
            levelUp: [
                { level: 1, move: "Placaje" },
                { level: 3, move: "Gruñido" },
                { level: 7, move: "Látigo Cepa" },
                { level: 9, move: "Somnífero" },
                { level: 13, move: "Polvo Veneno" },
                { level: 20, move: "Rayo Solar" }
            ],
            egg: ["Danza Pétalo", "Síntesis"],
            tm: ["Vuelo", "Rayo Solar", "Danza Espada", "Descanso"]
        }
    },
    "Charmander": {
        id: 4,
        types: ["Fuego"],
        baseStats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 },
        abilities: ["Mar Llamas", "Poder Solar"],
        learnset: {
            levelUp: [
                { level: 1, move: "Arañazo" },
                { level: 1, move: "Gruñido" },
                { level: 7, move: "Ascuas" },
                { level: 10, move: "Pantalla de Humo" },
                { level: 16, move: "Furia Dragón" },
                { level: 28, move: "Lanzallamas" }
            ],
            egg: ["Danaza Dragón", "Garra Dragón"],
            tm: ["Vuelo", "Lanzallamas", "Excavar", "Danza Espada"]
        }
    },
    "Squirtle": {
        id: 7,
        types: ["Agua"],
        baseStats: { hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43 },
        abilities: ["Torrente", "Cura Lluvia"],
        learnset: {
            levelUp: [
                { level: 1, move: "Placaje" },
                { level: 4, move: "Látigo" },
                { level: 7, move: "Burbuja" },
                { level: 10, move: "Retirada" },
                { level: 13, move: "Pistola Agua" },
                { level: 19, move: "Mordisco" }
            ],
            egg: ["Acua Jet", "Anillo de Agua"],
            tm: ["Surf", "Cascada", "Rayo Hielo", "Descanso"]
        }
    }
};

// Movimientos (solo los necesarios para los Pokémon de ejemplo)
const MOVES = {
    "Placaje": { type: "Normal", power: 50, accuracy: 100, pp: 35 },
    "Gruñido": { type: "Normal", power: 0, accuracy: 100, pp: 40 },
    "Látigo Cepa": { type: "Planta", power: 45, accuracy: 100, pp: 25 },
    "Somnífero": { type: "Planta", power: 0, accuracy: 75, pp: 15 },
    "Polvo Veneno": { type: "Veneno", power: 0, accuracy: 75, pp: 35 },
    "Rayo Solar": { type: "Planta", power: 120, accuracy: 100, pp: 10 },
    "Danza Pétalo": { type: "Planta", power: 120, accuracy: 100, pp: 10 },
    "Síntesis": { type: "Planta", power: 0, accuracy: 0, pp: 5 },
    "Vuelo": { type: "Volador", power: 90, accuracy: 95, pp: 15 },
    "Danza Espada": { type: "Normal", power: 0, accuracy: 0, pp: 20 },
    "Descanso": { type: "Psíquico", power: 0, accuracy: 0, pp: 10 },
    "Arañazo": { type: "Normal", power: 40, accuracy: 100, pp: 35 },
    "Ascuas": { type: "Fuego", power: 40, accuracy: 100, pp: 25 },
    "Pantalla de Humo": { type: "Normal", power: 0, accuracy: 100, pp: 20 },
    "Furia Dragón": { type: "Dragón", power: 0, accuracy: 100, pp: 10 },
    "Lanzallamas": { type: "Fuego", power: 95, accuracy: 100, pp: 15 },
    "Danaza Dragón": { type: "Dragón", power: 0, accuracy: 100, pp: 20 },
    "Garra Dragón": { type: "Dragón", power: 80, accuracy: 100, pp: 15 },
    "Excavar": { type: "Tierra", power: 80, accuracy: 100, pp: 10 },
    "Látigo": { type: "Normal", power: 0, accuracy: 100, pp: 30 },
    "Burbuja": { type: "Agua", power: 40, accuracy: 100, pp: 30 },
    "Retirada": { type: "Agua", power: 0, accuracy: 0, pp: 40 },
    "Pistola Agua": { type: "Agua", power: 40, accuracy: 100, pp: 25 },
    "Mordisco": { type: "Siniestro", power: 60, accuracy: 100, pp: 25 },
    "Acua Jet": { type: "Agua", power: 40, accuracy: 100, pp: 20 },
    "Anillo de Agua": { type: "Agua", power: 0, accuracy: 0, pp: 20 },
    "Surf": { type: "Agua", power: 95, accuracy: 100, pp: 15 },
    "Cascada": { type: "Agua", power: 80, accuracy: 100, pp: 15 },
    "Rayo Hielo": { type: "Hielo", power: 95, accuracy: 100, pp: 10 }
};

// Habilidades
const ABILITIES = [
    "Espuma", "Mar Llamas", "Torrente", "Clorofila", "Poder Solar", "Cura Lluvia", "Espesura"
];

// Objetos (solo unos cuantos de ejemplo)
const ITEMS = [
    "Baya Zidra", "Vidasfera", "Pañuelo Elegido", "Restos", "Casco Dentado",
    "Cinta Focus", "Hierba Blanca", "Lodo Negro", "Banda Focus", "Bola Humo"
];

// Naturalezas con sus modificadores
const NATURES = {
    "Fuerte":    { up: "atk", down: "atk" }, // neutra
    "Huraña":    { up: "atk", down: "def" },
    "Audaz":     { up: "atk", down: "spa" },
    "Firme":     { up: "atk", down: "spd" },
    "Pícara":    { up: "atk", down: "spe" },
    "Osada":     { up: "def", down: "atk" },
    "Dócil":     { up: "def", down: "def" }, // neutra
    "Agitada":   { up: "def", down: "spa" },
    "Plácida":   { up: "def", down: "spd" },
    "Serena":    { up: "def", down: "spe" },
    "Modesta":   { up: "spa", down: "atk" },
    "Afable":    { up: "spa", down: "def" },
    "Tímida":    { up: "spa", down: "spa" }, // neutra
    "Floja":     { up: "spa", down: "spd" },
    "Alegre":    { up: "spa", down: "spe" },
    "Mansa":     { up: "spd", down: "atk" },
    "Seria":     { up: "spd", down: "def" },
    "Grosera":   { up: "spd", down: "spa" },
    "Cauta":     { up: "spd", down: "spd" }, // neutra
    "Activa":    { up: "spd", down: "spe" },
    "Miedosa":   { up: "spe", down: "atk" },
    "Ingenua":   { up: "spe", down: "def" },
    "Alocada":   { up: "spe", down: "spa" },
    "Alegre":    { up: "spe", down: "spd" },
    "Rara":      { up: "spe", down: "spe" }  // neutra
};