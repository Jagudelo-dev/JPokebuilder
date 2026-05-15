// data.js - Base de datos del Team Builder (Gen V)
// Datos de ejemplo con learnsets ampliados (movs Gen 1‑9)

const POKEDEX = {
    "Bulbasaur": {
        id: 1,
        types: ["Planta", "Veneno"],
        baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
        abilities: ["Espesura", "Clorofila"],
        learnset: {
            levelUp: [
                { level: 1, move: "Placaje" },
                { level: 1, move: "Gruñido" },
                { level: 3, move: "Látigo Cepa" },
                { level: 7, move: "Somnífero" },
                { level: 9, move: "Polvo Veneno" },
                { level: 13, move: "Hoja Afilada" },      // Gen 5+
                { level: 20, move: "Rayo Solar" },
                { level: 25, move: "Danza Pétalo" },
                { level: 31, move: "Síntesis" },
                { level: 39, move: "Campo de Hierba" }    // Gen 6+
            ],
            egg: [
                "Danza Pétalo", "Síntesis", "Poder Pasado",
                "Hoja Aguda", "Respiro", "Lluehoja"
            ],
            tm: [
                "Vuelo", "Rayo Solar", "Danza Espada", "Descanso",
                "Tierra Viva", "Agua Lodosa", "Respiro",
                "Ida y Vuelta", "Protección", "Tormenta de Arena",
                "Abatidoras", "Roca Afilada", "Hierba Lazo"
            ]
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
                { level: 28, move: "Lanzallamas" },
                { level: 34, move: "Tajo Umbrío" },       // Gen 4+
                { level: 46, move: "Envite Ígneo" }       // Gen 6+
            ],
            egg: [
                "Danza Dragón", "Garra Dragón", "Pulso Dragón",
                "Arañazo", "Contraataque"
            ],
            tm: [
                "Vuelo", "Lanzallamas", "Excavar", "Danza Espada",
                "Roca Afilada", "Tierra Viva", "Puño Drenaje",
                "Danza Dragón", "Alarido", "Protección"
            ]
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
                { level: 19, move: "Mordisco" },
                { level: 25, move: "Rayo Burbuja" },
                { level: 34, move: "Cabeza de Hierro" },  // Gen 5+
                { level: 40, move: "Hidrobomba" }
            ],
            egg: [
                "Acua Jet", "Anillo de Agua", "Espejo",
                "Salpicar", "Manto Espejo"
            ],
            tm: [
                "Surf", "Cascada", "Rayo Hielo", "Descanso",
                "Roca Afilada", "Tierra Viva", "Ida y Vuelta",
                "Protección", "Hidrocañón", "Escaldar"
            ]
        }
    }
};

// Habilidades (puedes ampliar con las reales de cada Pokémon)
const ABILITIES = [
    "Espuma", "Mar Llamas", "Torrente", "Clorofila", "Poder Solar", "Cura Lluvia", "Espesura"
];

// Objetos competitivos (lista parcial, puedes añadir más)
const ITEMS = [
    "Baya Zidra", "Vidasfera", "Pañuelo Elegido", "Restos", "Casco Dentado",
    "Cinta Focus", "Hierba Blanca", "Lodo Negro", "Banda Focus", "Bola Humo"
];

// Naturalezas con sus modificadores (25 naturalezas, completa)
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