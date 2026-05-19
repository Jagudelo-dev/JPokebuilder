// js/advisorData.js - Conocimiento experto para el asistente táctico

// -------------------------------------------------------------------
// BUILDS RECOMENDADOS POR POKÉMON (objeto clave = nombre en español)
// -------------------------------------------------------------------
const BUILDS = {
    "Bulbasaur": [
        {
            name: "Tanque defensivo",
            ability: "Clorofila",
            item: "Restos",
            nature: "Osada",
            evs: { hp: 252, def: 252, spd: 4 },
            moves: ["Síntesis", "Rayo Solar", "Látigo Cepa", "Polvo Veneno"],
            description: "Aguanta golpes físicos y se recupera con Síntesis."
        }
    ],
    "Charmander": [
        {
            name: "Barredor especial",
            ability: "Mar Llamas",
            item: "Vidasfera",
            nature: "Miedosa",
            evs: { spa: 252, spe: 252, hp: 4 },
            moves: ["Lanzallamas", "Pulso Dragón", "Tajo Umbrío", "Danza Dragón"],
            description: "Veloz y potente, puede hacer sweeping tras un boost."
        }
    ],
    "Squirtle": [
        {
            name: "Muro defensivo",
            ability: "Torrente",
            item: "Restos",
            nature: "Osada",
            evs: { hp: 252, def: 252, spd: 4 },
            moves: ["Escaldar", "Rayo Hielo", "Protección", "Surf"],
            description: "Defensa física alta con Escaldar para quemar."
        }
    ]
};

// -------------------------------------------------------------------
// REGLAS DE EQUIPO (cada regla es un objeto con id, check y mensajes)
// -------------------------------------------------------------------
const TEAM_RULES = [
    {
        id: "cortavoltios",
        description: "Inmunidad a tipo Eléctrico",
        check: function(team) {
            return team.some(p => p.baseData && (
                p.baseData.types.includes("Tierra") ||
                p.ability === "Absorbe Electricidad" ||
                p.ability === "Motor"
            ));
        },
        message: "✅ Tienes un cortavoltios (inmune a Eléctrico).",
        warning: "⚠️ No tienes inmunidad a Eléctrico. Considera un tipo Tierra o habilidad Absorbe Electricidad / Motor."
    },
    {
        id: "cobertura_fuego",
        description: "Movimientos de tipo Fuego en el equipo",
        check: function(team) {
            return team.some(p => p.moves.some(m => m && MOVES[m] && MOVES[m].type === "Fuego"));
        },
        message: "🔥 Cobertura Fuego presente.",
        warning: "🔥 Ningún movimiento de Fuego. Podrías tener problemas contra Acero y Planta."
    },
    {
        id: "cobertura_hielo",
        description: "Movimientos de tipo Hielo en el equipo",
        check: function(team) {
            return team.some(p => p.moves.some(m => m && MOVES[m] && MOVES[m].type === "Hielo"));
        },
        message: "❄️ Cobertura Hielo presente.",
        warning: "❄️ Sin movimientos de Hielo. Dragones y Voladores podrían ser un problema."
    },
    {
        id: "cobertura_lucha",
        description: "Movimientos de tipo Lucha en el equipo",
        check: function(team) {
            return team.some(p => p.moves.some(m => m && MOVES[m] && MOVES[m].type === "Lucha"));
        },
        message: "🥊 Cobertura Lucha presente.",
        warning: "🥊 Sin movimientos de Lucha. Acero y Normal pueden ser difíciles de tumbar."
    },
    {
        id: "debilidad_roca",
        description: "Máximo 2 Pokémon débiles a Roca",
        check: function(team) {
            const weakToRock = team.filter(p => {
                if (!p.baseData) return false;
                const effectiveness = getTypeEffectiveness(p.baseData.types);
                return effectiveness["Roca"] > 1;
            }).length;
            return weakToRock <= 2;
        },
        message: "🪨 Buena gestión de debilidades a Roca.",
        warning: "⚠️ Tienes 3 o más Pokémon débiles a Roca. Trampas de rocas te harán mucho daño."
    },
    {
        id: "velocidad_extrema",
        description: "Al menos un Pokémon rápido (+100 Spe base)",
        check: function(team) {
            return team.some(p => p.baseData && p.baseData.baseStats.spe >= 100);
        },
        message: "⚡ Tienes al menos un Pokémon veloz.",
        warning: "🐢 Ningún Pokémon supera 100 de velocidad base. Puede que te superen fácilmente."
    },
    {
        id: "multiples_roles",
        description: "Variedad de roles (ofensivo, defensivo)",
        check: function(team) {
            // Simplificación: si hay al menos uno con alta Def y uno con alto Atk/SpA
            const hasTank = team.some(p => p.baseData && p.baseData.baseStats.def >= 100);
            const hasAttacker = team.some(p => p.baseData && (p.baseData.baseStats.atk >= 100 || p.baseData.baseStats.spa >= 100));
            return hasTank && hasAttacker;
        },
        message: "🎭 Buen balance ofensivo/defensivo.",
        warning: "🎭 El equipo parece desbalanceado. Intenta mezclar Pokémon ofensivos y defensivos."
    }
];