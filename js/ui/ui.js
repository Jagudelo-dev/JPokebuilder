// ui.js - Interfaz de usuario y eventos

let team = new Team();
let selectedSlot = 0;

// Cargar equipo guardado al iniciar
(function initPersistence() {
    const savedData = loadTeam();
    if (savedData) {
        applyLoadedTeam(team, savedData);
    }
})();

// Renderiza todo el equipo y el editor
function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="team-grid" id="teamGrid"></div>
        <div class="toolbar">
            <button id="exportBtn">📋 Exportar Equipo</button>
            <button id="importBtn">📥 Importar Equipo</button>
        </div>
        <div id="importPanel" class="import-panel hidden">
            <textarea id="importTextarea" placeholder="Pega aquí el equipo en formato Showdown..."></textarea>
            <button id="importConfirmBtn">Importar</button>
            <button id="importCancelBtn">Cancelar</button>
        </div>
        <div class="editor" id="editorPanel"></div>
    `;
    renderTeamSlots();
    renderEditor();

    // --- Eventos de exportación/importación ---
    document.getElementById('exportBtn').addEventListener('click', () => {
        const text = teamToShowdown(team);
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Equipo copiado al portapapeles en formato Showdown.');
        });
    });

    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importPanel').classList.remove('hidden');
    });

    document.getElementById('importCancelBtn').addEventListener('click', () => {
        document.getElementById('importPanel').classList.add('hidden');
        document.getElementById('importTextarea').value = '';
    });

    document.getElementById('importConfirmBtn').addEventListener('click', () => {
        const text = document.getElementById('importTextarea').value;
        const imported = showdownToTeam(text);
        imported.forEach((data, idx) => {
            if (data && idx < 6) {
                team.setSlot(idx, data.pokemon);
                const pkmn = team.getSlot(idx);
                if (pkmn) {
                    pkmn.nickname = data.nickname;
                    pkmn.item = data.item;
                    pkmn.ability = data.ability || pkmn.baseData.abilities[0];
                    pkmn.nature = data.nature || 'Fuerte';
                    pkmn.evs = data.evs;
                    pkmn.moves = data.moves.slice(0, 4);
                }
            }
        });
        document.getElementById('importPanel').classList.add('hidden');
        document.getElementById('importTextarea').value = '';
        saveTeam(team);          // guardar automáticamente tras importar
        renderApp();
    });
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
                saveTeam(team);   // guardar tras cambiar el Pokémon
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
            <h2>
                ${base.id ? '#' + base.id + ' ' : ''}${Object.keys(POKEDEX).find(k => POKEDEX[k] === base)}
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${base.id}.png"
                     alt="${Object.keys(POKEDEX).find(k => POKEDEX[k] === base)}"
                     style="height: 60px; vertical-align: middle; margin-left: 0.5rem;">
            </h2>
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
                            ${availableMoves.map(m => {
                                const moveData = MOVES[m];
                                const details = moveData ? ` [${moveData.type}] ${moveData.power ? moveData.power + 'p' : '—'}` : '';
                                return `<option value="${m}" ${pokemon.moves[i] === m ? 'selected' : ''}>${m}${details}</option>`;
                            }).join('')}
                        </select>
                    </li>
                `).join('')}
            </ul>
        </div>

        <!-- Columna de cobertura ofensiva -->
        <div class="editor-column">
            <h3>Cobertura Ofensiva</h3>
            <div id="coverageDisplay"></div>
        </div>

        <!-- Columna del asistente táctico -->
        <div class="editor-column">
            <h3>🧠 Asistente Táctico</h3>
            <div id="advisorPanel"></div>
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

            <h3>Stats Base</h3>
            <canvas id="statsRadar" width="250" height="250" style="display:block; margin: 0 auto;"></canvas>
            <div style="text-align:center; font-size:0.8rem; margin-top:0.3rem;">
                <span style="color:#1abc9c;">■ Pokémon</span>
                <span style="color:#e67e22; margin-left:1rem;">■ Promedio equipo</span>
            </div>

            <h3>Resistencias y Debilidades</h3>
            <div id="typeEffectiveness"></div>
        </div>
    `;

    // --- Event listeners con auto-guardado ---
    document.getElementById('nickname').addEventListener('input', (e) => {
        pokemon.nickname = e.target.value;
        renderTeamSlots();
        autoSave();
    });
    document.getElementById('level').addEventListener('input', (e) => {
        pokemon.level = parseInt(e.target.value) || 50;
        renderEditor();
        // autoSave se llamará al final de renderEditor
    });
    document.getElementById('ability').addEventListener('change', (e) => {
        pokemon.ability = e.target.value;
        updateAdvice();
        autoSave();
    });
    document.getElementById('item').addEventListener('change', (e) => {
        pokemon.item = e.target.value;
        renderTeamSlots();
        updateAdvice();
        autoSave();
    });
    document.getElementById('nature').addEventListener('change', (e) => {
        pokemon.nature = e.target.value;
        renderEditor();
    });

    // Movimientos
    for (let i = 0; i < 4; i++) {
        document.getElementById(`move${i}`).addEventListener('change', (e) => {
            pokemon.moves[i] = e.target.value;
            updateCoverage();
            updateAdvice();
            autoSave();
        });
    }

    // IVs & EVs
    ['hp','atk','def','spa','spd','spe'].forEach(stat => {
        document.getElementById(`iv-${stat}`).addEventListener('input', (e) => {
            pokemon.ivs[stat] = Math.min(31, Math.max(0, parseInt(e.target.value) || 0));
            renderEditor();
            autoSave();
        });
        document.getElementById(`ev-${stat}`).addEventListener('input', (e) => {
            pokemon.evs[stat] = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
            validateEVs();
            renderEditor();
            autoSave();
        });
    });

    validateEVs();

    // Dibujar gráfico de stats base + promedio del equipo
    const avgStats = calculateTeamAverageStats(team);
    drawStatsGraph('statsRadar', base.baseStats, avgStats);

    // Mostrar tabla de resistencias/debilidades según tipos del Pokémon
    const effectiveness = getTypeEffectiveness(base.types);
    const categories = categorizeEffectiveness(effectiveness);
    const typeDiv = document.getElementById('typeEffectiveness');
    if (typeDiv) {
        typeDiv.innerHTML = `
            <p><strong>Inmune a:</strong> ${categories.inmune.length ? categories.inmune.join(', ') : 'Ninguno'}</p>
            <p><strong>Resiste (½ o ¼):</strong> ${categories.resiste.map(r => `${r.type} (×${r.multiplier})`).join(', ') || 'Ninguno'}</p>
            <p><strong>Débil (×2 o ×4):</strong> ${categories.debil.map(d => `${d.type} (×${d.multiplier})`).join(', ') || 'Ninguno'}</p>
            <p><strong>Neutral:</strong> ${categories.neutral.join(', ')}</p>
        `;
    }

    // Calcular cobertura y asistente inicial
    updateCoverage();
    updateAdvice();

    // Auto-guardar tras cargar el editor (por si hubo cambios en renderEditor que ya guardan, redundante pero seguro)
    autoSave();
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

// Actualizar cobertura ofensiva en la UI
function updateCoverage() {
    const pokemon = team.getSlot(selectedSlot);
    if (!pokemon || !pokemon.baseData) return;
    const coverageData = calculateCoverage(pokemon.moves);
    const div = document.getElementById('coverageDisplay');
    if (div) {
        div.innerHTML = renderCoverageHTML(coverageData);
    }
}

// Actualizar panel del asistente táctico
function updateAdvice() {
    const advice = getAdvice(team, selectedSlot);
    const panel = document.getElementById('advisorPanel');
    if (panel) {
        panel.innerHTML = renderAdviceHTML(advice);
    }
}

// --- Funciones de persistencia y exportación (Fase 6) ---
function autoSave() {
    saveTeam(team);
}