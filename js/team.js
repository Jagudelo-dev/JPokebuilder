// team.js - Lógica del equipo y cálculos de stats

class Pokemon {
    constructor(data) {
        this.baseData = data;                 // objeto de POKEDEX
        this.nickname = data ? Object.keys(POKEDEX)[0] : '';
        this.level = 50;
        this.ability = data ? data.abilities[0] : '';
        this.item = '';
        this.nature = 'Fuerte';
        this.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
        this.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
        this.moves = ['', '', '', ''];        // exactamente 4 movimientos
        this.resetFromBase(data);
    }

    resetFromBase(data) {
        this.baseData = data;
        if (data) {
            this.nickname = Object.keys(POKEDEX).find(k => POKEDEX[k] === data);
            this.ability = data.abilities[0];
            this.moves = ['', '', '', ''];
        }
    }

    // Calcula estadísticas finales según fórmula Gen V
    calculateStats() {
        if (!this.baseData) return null;
        const base = this.baseData.baseStats;
        const natureMod = NATURES[this.nature];
        const stats = {};

        // HP
        const hpIV = this.ivs.hp;
        const hpEV = this.evs.hp;
        stats.hp = Math.floor(
            ((2 * base.hp + hpIV + Math.floor(hpEV / 4)) * this.level) / 100
        ) + this.level + 10;

        // Otras stats
        const otherStatNames = ['atk', 'def', 'spa', 'spd', 'spe'];
        otherStatNames.forEach(stat => {
            const iv = this.ivs[stat];
            const ev = this.evs[stat];
            let value = Math.floor(
                ((2 * base[stat] + iv + Math.floor(ev / 4)) * this.level) / 100
            ) + 5;

            // Aplicar naturaleza
            const up = natureMod.up;
            const down = natureMod.down;
            if (up === stat && up !== down) {
                value = Math.floor(value * 1.1);
            } else if (down === stat && up !== down) {
                value = Math.floor(value * 0.9);
            }
            stats[stat] = value;
        });

        return stats;
    }

    // Obtiene movimientos disponibles según nivel, huevo y TM
    getAvailableMoves() {
        if (!this.baseData) return [];
        const learnset = this.baseData.learnset;
        const levelMoves = learnset.levelUp
            .filter(entry => entry.level <= this.level)
            .map(entry => entry.move);
        const eggMoves = learnset.egg || [];
        const tmMoves = learnset.tm || [];

        // Unión sin duplicados
        return [...new Set([...levelMoves, ...eggMoves, ...tmMoves])];
    }
}

class Team {
    constructor() {
        this.slots = new Array(6).fill(null).map(() => new Pokemon(null));
    }

    setSlot(index, pokemonName) {
        const data = POKEDEX[pokemonName];
        if (data) {
            this.slots[index] = new Pokemon(data);
        }
    }

    getSlot(index) {
        return this.slots[index];
    }
}