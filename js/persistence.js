// js/persistence.js - Guardar y cargar equipo en localStorage

const STORAGE_KEY = 'pokemon_team_builder_team';

function saveTeam(team) {
    const data = team.slots.map(slot => ({
        pokemon: slot.baseData ? Object.keys(POKEDEX).find(k => POKEDEX[k] === slot.baseData) : null,
        nickname: slot.nickname,
        level: slot.level,
        ability: slot.ability,
        item: slot.item,
        nature: slot.nature,
        ivs: slot.ivs,
        evs: slot.evs,
        moves: slot.moves
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadTeam() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function applyLoadedTeam(team, data) {
    data.forEach((slotData, idx) => {
        if (slotData.pokemon && POKEDEX[slotData.pokemon]) {
            team.setSlot(idx, slotData.pokemon);
            const pkmn = team.getSlot(idx);
            pkmn.nickname = slotData.nickname || '';
            pkmn.level = slotData.level || 50;
            pkmn.ability = slotData.ability || pkmn.baseData.abilities[0];
            pkmn.item = slotData.item || '';
            pkmn.nature = slotData.nature || 'Fuerte';
            pkmn.ivs = slotData.ivs || { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
            pkmn.evs = slotData.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
            pkmn.moves = slotData.moves || ['', '', '', ''];
        }
    });
}