// js/typeCalc.js - Cálculo de eficacias según tipos del Pokémon

function getTypeEffectiveness(pokemonTypes) {
    const effectiveness = {};
    const allTypes = Object.keys(TYPE_CHART);
    
    allTypes.forEach(attackType => {
        let multiplier = 1;
        pokemonTypes.forEach(defType => {
            if (TYPE_CHART[attackType] && TYPE_CHART[attackType][defType] !== undefined) {
                multiplier *= TYPE_CHART[attackType][defType];
            }
        });
        effectiveness[attackType] = multiplier;
    });
    
    return effectiveness;
}

function categorizeEffectiveness(effectiveness) {
    return {
        inmune: Object.entries(effectiveness).filter(([_, val]) => val === 0).map(([type]) => type),
        resiste: Object.entries(effectiveness).filter(([_, val]) => val === 0.25 || val === 0.5).map(([type, val]) => ({ type, multiplier: val })),
        neutral: Object.entries(effectiveness).filter(([_, val]) => val === 1).map(([type]) => type),
        debil: Object.entries(effectiveness).filter(([_, val]) => val === 2 || val === 4).map(([type, val]) => ({ type, multiplier: val })),
    };
}