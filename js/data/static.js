// data.js - Base de datos del Team Builder (Gen V)

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