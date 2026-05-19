// js/coverageCalc.js - Calculador de cobertura ofensiva según movimientos

/**
 * Calcula la cobertura ofensiva de un array de movimientos.
 * @param {string[]} moveNames - Nombres exactos de los movimientos (según MOVES)
 * @returns {object} coverageData - { byType, summary }
 */
function calculateCoverage(moveNames) {
    const attackTypes = [];
    moveNames.forEach(name => {
        if (name && MOVES[name]) {
            const type = MOVES[name].type;
            if (!attackTypes.includes(type)) {
                attackTypes.push(type);
            }
        }
    });

    if (attackTypes.length === 0) {
        return null; // Sin movimientos seleccionados
    }

    const allDefenderTypes = Object.keys(TYPE_CHART);
    const byType = {}; // { "Normal": multiplier, ... }

    allDefenderTypes.forEach(defType => {
        let maxMultiplier = 0;
        attackTypes.forEach(atkType => {
            if (TYPE_CHART[atkType] && TYPE_CHART[atkType][defType] !== undefined) {
                const mult = TYPE_CHART[atkType][defType];
                if (mult > maxMultiplier) maxMultiplier = mult;
            } else {
                // Si no hay entrada, asumimos 1
                if (1 > maxMultiplier) maxMultiplier = 1;
            }
        });
        byType[defType] = maxMultiplier;
    });

    // Categorizar
    const summary = {
        superEfectivo: [],  // ×2 o ×4
        neutral: [],
        resistido: [],      // ×0.5 o ×0.25
        inmune: []          // ×0
    };

    for (const [type, mult] of Object.entries(byType)) {
        if (mult === 0) summary.inmune.push(type);
        else if (mult < 1) summary.resistido.push(type);
        else if (mult === 1) summary.neutral.push(type);
        else summary.superEfectivo.push(type);
    }

    return { byType, summary };
}

/**
 * Genera HTML para mostrar la cobertura en una tabla compacta de tipos.
 */
function renderCoverageHTML(coverageData) {
    if (!coverageData) return '<p>Selecciona al menos un movimiento para ver la cobertura.</p>';

    const { byType, summary } = coverageData;
    const allTypes = Object.keys(TYPE_CHART);

    let html = '<div class="coverage-grid">';
    allTypes.forEach(type => {
        const mult = byType[type];
        let cssClass = 'neutral';
        let label = '×1';
        if (mult === 0) { cssClass = 'inmune'; label = '×0'; }
        else if (mult < 1) { cssClass = 'resistido'; label = '×' + mult; }
        else if (mult > 1) { cssClass = 'super-efectivo'; label = '×' + mult; }

        html += `<span class="type-badge type-${type.toLowerCase()} ${cssClass}" title="${type}: ${label}">${type}</span>`;
    });
    html += '</div>';

    // Resumen textual
    html += '<div class="coverage-summary">';
    html += `<p><strong>Supereficaz contra:</strong> ${summary.superEfectivo.length ? summary.superEfectivo.join(', ') : 'Ninguno'}</p>`;
    html += `<p><strong>Neutral:</strong> ${summary.neutral.length ? summary.neutral.join(', ') : 'Ninguno'}</p>`;
    html += `<p><strong>Resistido por:</strong> ${summary.resistido.length ? summary.resistido.join(', ') : 'Ninguno'}</p>`;
    html += `<p><strong>Inmune:</strong> ${summary.inmune.length ? summary.inmune.join(', ') : 'Ninguno'}</p>`;
    html += '</div>';

    return html;
}