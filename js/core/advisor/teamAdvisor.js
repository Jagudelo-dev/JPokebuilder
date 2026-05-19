// js/teamAdvisor.js - Motor del asistente táctico

/**
 * Analiza el equipo completo y devuelve una lista de objetos consejo.
 * @param {Team} team - instancia del equipo actual
 * @param {number} selectedSlot - índice del slot activo (0-5)
 * @returns {Array} consejos: [{ type: 'success'|'warning'|'info', text: '...' }]
 */
function getAdvice(team, selectedSlot) {
    const advice = [];

    // 1. Evaluar reglas globales del equipo
    TEAM_RULES.forEach(rule => {
        const passed = rule.check(team.slots);
        advice.push({
            type: passed ? 'success' : 'warning',
            text: passed ? rule.message : rule.warning,
            rule: rule.id
        });
    });

    // 2. Si hay un Pokémon seleccionado con baseData, sugerir builds
    const pokemon = team.getSlot(selectedSlot);
    if (pokemon && pokemon.baseData) {
        const pokemonName = Object.keys(POKEDEX).find(k => POKEDEX[k] === pokemon.baseData);
        if (BUILDS[pokemonName]) {
            BUILDS[pokemonName].forEach(build => {
                advice.push({
                    type: 'info',
                    text: `📦 Build "${build.name}": ${build.description} (${build.item}, ${build.nature}, EVs ${JSON.stringify(build.evs)})`
                });
            });
        }

        // 3. Consejos específicos según estadísticas base
        const base = pokemon.baseData.baseStats;
        if (base.hp >= 100) {
            advice.push({ type: 'info', text: '💚 Tiene buena salud base, puede aguantar golpes.' });
        }
        if (base.atk >= 120) {
            advice.push({ type: 'info', text: '⚔️ Ataque físico muy alto. Aprovecha movimientos físicos STAB.' });
        }
        if (base.spa >= 120) {
            advice.push({ type: 'info', text: '🔮 Ataque especial muy alto. Puede ser un wallbreaker especial.' });
        }
        if (base.spe >= 110) {
            advice.push({ type: 'info', text: '💨 Velocidad excelente. Ideal para sweep tardío.' });
        }

        // 4. Validar movimientos repetidos en el mismo Pokémon
        const uniqueMoves = [...new Set(pokemon.moves.filter(m => m !== ''))];
        if (uniqueMoves.length < pokemon.moves.filter(m => m !== '').length) {
            advice.push({ type: 'warning', text: '⚠️ Tienes movimientos repetidos en este Pokémon.' });
        }

        // 5. Verificar que no lleve más de 4 movimientos de estado (ya el selector solo deja 4, pero por si acaso)
        const statusMoves = pokemon.moves.filter(m => m && MOVES[m] && MOVES[m].category === 'Estado');
        if (statusMoves.length >= 3) {
            advice.push({ type: 'warning', text: '⚠️ Este Pokémon tiene muchos movimientos de estado, puede quedar pasivo.' });
        }
    }

    // 6. Si hay slots vacíos, avisar
    const emptySlots = team.slots.filter(s => !s.baseData).length;
    if (emptySlots > 0) {
        advice.push({ type: 'warning', text: `🕳️ Aún tienes ${emptySlots} hueco(s) vacío(s) en el equipo.` });
    }

    return advice;
}

/**
 * Convierte el array de consejos en HTML para mostrar en el panel.
 */
function renderAdviceHTML(advice) {
    if (!advice || advice.length === 0) {
        return '<p>No hay consejos por ahora.</p>';
    }
    let html = '<ul class="advice-list">';
    advice.forEach(item => {
        html += `<li class="advice-item ${item.type}">${item.text}</li>`;
    });
    html += '</ul>';
    return html;
}