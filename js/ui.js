// ui.js - Interfaz de usuario y eventos

let team = new Team();
let selectedSlot = 0;

// Renderiza todo el equipo y el editor
function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="team-grid" id="teamGrid"></div>
        <div class="editor" id="editorPanel"></div>
    `;
    renderTeamSlots();
    renderEditor();
}

// Renderiza los 6 slots del equipo
function renderTeamSlots() {
    const grid = document.getElementById('teamGrid');
    grid.innerHTML = '';

    team.slots.forEach((pokemon, idx) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = `slot ${selectedSlot === idx ? 'selected' : ''}`;
        slotDiv.innerHTML = `
            <div class="pokemon-icon">${pokemon.baseData ? '🔴' : '⚪'}</div>
            <div class="pokemon-name">${pokemon.baseData ? pokemon.nickname || '???' : 'Vacío'}</div>
            <div class="pokemon-item">${pokemon.item || 'Sin objeto'}</div>
        `;
        slotDiv.addEventListener('click', () => {
            selectedSlot = idx;
            renderApp();
        });
        grid.appendChild(slotDiv);
    });
}

// Renderiza el panel de edición del Pokémon seleccionado
function renderEditor() {
    const panel = document.getElementById('editorPanel');
    const pokemon = team.getSlot(selectedSlot);

    if (!pokemon.baseData) {
        panel.innerHTML = `
            <div class="editor-column">
                <h2>Selecciona un Pokémon</h2>
                <select id="pokemonSelect">
                    <option value="">-- Elige Pokémon --</option>
                    ${Object.keys(POKEDEX).map(name => `<option value="${name}">${name}</option>`).join('')}
                </select>
            </div>
        `;
        document.getElementById('pokemonSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                team.setSlot(selectedSlot, e.target.value);
                renderApp();
            }
        });
        return;
    }

    // Datos del Pokémon
    const base = pokemon.baseData;
    const stats = pokemon.calculateStats();
    const availableMoves = pokemon.getAvailableMoves();

    panel.innerHTML = `
        <div class="editor-column">
            <h2>${base.id ? '#' + base.id + ' ' : ''}${Object.keys(POKEDEX).find(k => POKEDEX[k] === base)}</h2>
            <div class="form-group">
                <label>Apodo</label>
                <input type="text" id="nickname" value="${pokemon.nickname || ''}" placeholder="Nombre del Pokémon">
            </div>
            <div class="form-group">
                <label>Nivel</label>
                <input type="number" id="level" min="1" max="100" value="${pokemon.level}">
            </div>
            <div class="form-group">
                <label>Habilidad</label>
                <select id="ability">
                    ${base.abilities.map(ab => `<option value="${ab}" ${pokemon.ability === ab ? 'selected' : ''}>${ab}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Objeto</label>
                <select id="item">
                    <option value="">Ninguno</option>
                    ${ITEMS.map(it => `<option value="${it}" ${pokemon.item === it ? 'selected' : ''}>${it}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Naturaleza</label>
                <select id="nature">
                    ${Object.keys(NATURES).map(nat => `<option value="${nat}" ${pokemon.nature === nat ? 'selected' : ''}>${nat}</option>`).join('')}
                </select>
            </div>
        </div>

        <div class="editor-column">
            <h3>Movimientos</h3>
            <ul class="moves-list">
                ${[0,1,2,3].map(i => `
                    <li class="move-slot">
                        <label>Movimiento ${i+1}</label>
                        <select id="move${i}">
                            <option value="">- Vacío -</option>
                            ${availableMoves.map(m => `<option value="${m}" ${pokemon.moves[i] === m ? 'selected' : ''}>${m}</option>`).join('')}
                        </select>
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="editor-column">
            <h3>IVs / EVs</h3>
            ${['hp','atk','def','spa','spd','spe'].map(stat => `
                <div class="stat-row">
                    <span class="stat-label">${stat.toUpperCase()}</span>
                    <input type="number" id="iv-${stat}" min="0" max="31" value="${pokemon.ivs[stat]}"> IV
                    <input type="number" id="ev-${stat}" min="0" max="255" value="${pokemon.evs[stat]}"> EV
                </div>
            `).join('')}
            <div id="evTotalMessage" class="error-message"></div>

            <h3>Estadísticas Totales</h3>
            <div class="total-stats">
                ${stats ? Object.entries(stats).map(([key, val]) => `<span>${key.toUpperCase()}: ${val}</span>`).join(' ') : ''}
            </div>
        </div>
    `;

    // Event listeners para actualizar el Pokémon
    document.getElementById('nickname').addEventListener('input', (e) => {
        pokemon.nickname = e.target.value;
        renderTeamSlots(); // actualizar nombre en el slot
    });
    document.getElementById('level').addEventListener('input', (e) => {
        pokemon.level = parseInt(e.target.value) || 50;
        renderEditor(); // recrea para actualizar movimientos disponibles y stats
    });
    document.getElementById('ability').addEventListener('change', (e) => {
        pokemon.ability = e.target.value;
    });
    document.getElementById('item').addEventListener('change', (e) => {
        pokemon.item = e.target.value;
        renderTeamSlots();
    });
    document.getElementById('nature').addEventListener('change', (e) => {
        pokemon.nature = e.target.value;
        renderEditor();
    });

    // Movimientos
    for (let i = 0; i < 4; i++) {
        document.getElementById(`move${i}`).addEventListener('change', (e) => {
            pokemon.moves[i] = e.target.value;
        });
    }

    // IVs & EVs
    ['hp','atk','def','spa','spd','spe'].forEach(stat => {
        document.getElementById(`iv-${stat}`).addEventListener('input', (e) => {
            pokemon.ivs[stat] = Math.min(31, Math.max(0, parseInt(e.target.value) || 0));
            renderEditor();
        });
        document.getElementById(`ev-${stat}`).addEventListener('input', (e) => {
            pokemon.evs[stat] = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
            validateEVs();
            renderEditor();
        });
    });

    validateEVs();
}

function validateEVs() {
    const pokemon = team.getSlot(selectedSlot);
    if (!pokemon) return;
    const totalEV = Object.values(pokemon.evs).reduce((a,b) => a + b, 0);
    const msgEl = document.getElementById('evTotalMessage');
    if (totalEV > 510) {
        msgEl.textContent = `Total de EVs (${totalEV}) supera el límite de 510.`;
    } else {
        msgEl.textContent = '';
    }
}