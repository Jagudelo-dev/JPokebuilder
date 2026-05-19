// js/exportImport.js - Conversión a/desde formato Showdown

function teamToShowdown(team) {
    return team.slots.map(slot => {
        if (!slot.baseData) return '';
        const name = Object.keys(POKEDEX).find(k => POKEDEX[k] === slot.baseData);
        const nickname = slot.nickname ? ` (${slot.nickname})` : '';
        const item = slot.item ? ` @ ${slot.item}` : '';
        const ability = slot.ability ? `Ability: ${slot.ability}` : '';
        const evs = Object.entries(slot.evs)
            .filter(([_, val]) => val > 0)
            .map(([stat, val]) => `${val} ${stat.toUpperCase()}`)
            .join(' / ');
        const nature = slot.nature ? `${slot.nature} Nature` : '';
        const moves = slot.moves.filter(m => m !== '').map(m => `- ${m}`).join('\n');

        let block = `${name}${nickname}${item}\n`;
        if (ability) block += `${ability}\n`;
        if (evs) block += `EVs: ${evs}\n`;
        if (nature) block += `${nature}\n`;
        if (moves) block += `${moves}`;
        return block.trim();
    }).filter(b => b !== '').join('\n\n');
}

function showdownToTeam(text) {
    const blocks = text.split(/\n\n+/);
    return blocks.map(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l !== '');
        if (lines.length === 0) return null;

        // Línea 1: Pokémon (Apodo) @ Objeto
        const firstLine = lines[0];
        let pokemonName = '';
        let nickname = '';
        let item = '';

        const itemMatch = firstLine.match(/^(.+?)\s*@\s*(.+)$/);
        const rawName = itemMatch ? itemMatch[1].trim() : firstLine.trim();
        const nickMatch = rawName.match(/^(.+?)\s*\((.+)\)$/);
        if (nickMatch) {
            pokemonName = nickMatch[1].trim();
            nickname = nickMatch[2].trim();
        } else {
            pokemonName = rawName.trim();
        }
        if (itemMatch) item = itemMatch[2].trim();

        if (!POKEDEX[pokemonName]) return null; // Pokémon no disponible

        const ability = lines.find(l => l.startsWith('Ability:'))?.replace('Ability:', '').trim() || '';
        const nature = lines.find(l => l.endsWith('Nature'))?.replace('Nature', '').trim() || '';
        const evsLine = lines.find(l => l.startsWith('EVs:'))?.replace('EVs:', '').trim() || '';
        const moves = lines.filter(l => l.startsWith('- ')).map(l => l.replace('- ', '').trim());

        // Parsear EVs
        const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
        evsLine.split('/').forEach(part => {
            const [val, stat] = part.trim().split(' ');
            if (val && stat && evs[stat.toLowerCase()] !== undefined) {
                evs[stat.toLowerCase()] = parseInt(val);
            }
        });

        return {
            pokemon: pokemonName,
            nickname,
            item,
            ability,
            nature,
            evs,
            moves: moves.concat(Array(4 - moves.length).fill(''))
        };
    });
}