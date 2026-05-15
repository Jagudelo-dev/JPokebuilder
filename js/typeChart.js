// js/typeChart.js - Tabla de eficacias de tipos (Gen 6+)
const TYPE_CHART = {
    "Normal":      { "Roca": 0.5, "Acero": 0.5, "Fantasma": 0 },
    "Fuego":       { "Fuego": 0.5, "Agua": 0.5, "Planta": 2, "Hielo": 2, "Bicho": 2, "Roca": 0.5, "Dragón": 0.5 },
    "Agua":        { "Fuego": 2, "Agua": 0.5, "Planta": 0.5, "Tierra": 2, "Roca": 2, "Dragón": 0.5 },
    "Planta":      { "Fuego": 0.5, "Agua": 2, "Planta": 0.5, "Veneno": 0.5, "Tierra": 2, "Volador": 0.5, "Bicho": 0.5, "Roca": 2, "Dragón": 0.5, "Acero": 0.5 },
    "Eléctrico":   { "Agua": 2, "Planta": 0.5, "Eléctrico": 0.5, "Tierra": 0, "Volador": 2, "Dragón": 0.5 },
    "Hielo":       { "Fuego": 0.5, "Agua": 0.5, "Planta": 2, "Hielo": 0.5, "Tierra": 2, "Volador": 2, "Dragón": 2, "Acero": 0.5 },
    "Lucha":       { "Normal": 2, "Hielo": 2, "Veneno": 0.5, "Volador": 0.5, "Psíquico": 0.5, "Bicho": 0.5, "Roca": 2, "Fantasma": 0, "Dragón": 1, "Siniestro": 2, "Acero": 2, "Hada": 0.5 },
    "Veneno":      { "Planta": 2, "Veneno": 0.5, "Tierra": 0.5, "Roca": 0.5, "Fantasma": 0.5, "Acero": 0, "Hada": 2 },
    "Tierra":      { "Fuego": 2, "Planta": 0.5, "Eléctrico": 2, "Veneno": 2, "Roca": 2, "Acero": 2, "Volador": 0 },
    "Volador":     { "Planta": 2, "Eléctrico": 0.5, "Lucha": 2, "Bicho": 2, "Roca": 0.5, "Acero": 0.5 },
    "Psíquico":    { "Lucha": 2, "Veneno": 2, "Psíquico": 0.5, "Siniestro": 0, "Acero": 0.5 },
    "Bicho":       { "Fuego": 0.5, "Planta": 2, "Lucha": 0.5, "Veneno": 0.5, "Volador": 0.5, "Psíquico": 2, "Fantasma": 0.5, "Siniestro": 2, "Acero": 0.5, "Hada": 0.5 },
    "Roca":        { "Fuego": 2, "Hielo": 2, "Lucha": 0.5, "Tierra": 0.5, "Volador": 2, "Bicho": 2, "Acero": 0.5 },
    "Fantasma":    { "Normal": 0, "Fantasma": 2, "Psíquico": 2, "Siniestro": 0.5 },
    "Dragón":      { "Dragón": 2, "Acero": 0.5, "Hada": 0 },
    "Siniestro":   { "Lucha": 0.5, "Fantasma": 2, "Psíquico": 2, "Siniestro": 0.5, "Hada": 0.5 },
    "Acero":       { "Fuego": 0.5, "Agua": 0.5, "Planta": 1, "Hielo": 2, "Lucha": 1, "Veneno": 1, "Tierra": 1, "Volador": 1, "Psíquico": 1, "Bicho": 1, "Roca": 2, "Fantasma": 1, "Dragón": 1, "Siniestro": 1, "Acero": 0.5, "Hada": 2 },
    "Hada":        { "Fuego": 0.5, "Lucha": 2, "Veneno": 0.5, "Dragón": 2, "Siniestro": 2, "Acero": 0.5 }
};