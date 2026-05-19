// js/statsGraph.js - Gráfico de stats base y promedio de equipo

function drawStatsGraph(canvasId, baseStats, averageStats = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    const values = stats.map(s => baseStats[s]);
    const avgValues = averageStats ? stats.map(s => averageStats[s]) : null;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    const maxStat = 255;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ejes
    ctx.strokeStyle = '#7f8c8d';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
        ctx.stroke();
    }
    
    // Niveles concéntricos
    for (let level = 0.2; level <= 1; level += 0.2) {
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const x = centerX + radius * level * Math.cos(angle);
            const y = centerY + radius * level * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    // Promedio del equipo
    if (avgValues) {
        ctx.beginPath();
        ctx.strokeStyle = '#e67e22';
        ctx.fillStyle = 'rgba(230, 126, 34, 0.2)';
        ctx.lineWidth = 2;
        avgValues.forEach((val, i) => {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const x = centerX + (radius * val / maxStat) * Math.cos(angle);
            const y = centerY + (radius * val / maxStat) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    // Pokémon actual
    ctx.beginPath();
    ctx.strokeStyle = '#1abc9c';
    ctx.fillStyle = 'rgba(26, 188, 156, 0.3)';
    ctx.lineWidth = 2.5;
    values.forEach((val, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = centerX + (radius * val / maxStat) * Math.cos(angle);
        const y = centerY + (radius * val / maxStat) * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Etiquetas
    ctx.fillStyle = '#ecf0f1';
    ctx.font = 'bold 12px Segoe UI';
    ctx.textAlign = 'center';
    stats.forEach((stat, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = centerX + (radius + 15) * Math.cos(angle);
        const y = centerY + (radius + 15) * Math.sin(angle);
        ctx.fillText(stat.toUpperCase(), x, y);
    });
}

function calculateTeamAverageStats(team) {
    const statsSum = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    let count = 0;
    team.slots.forEach(slot => {
        if (slot.baseData) {
            const base = slot.baseData.baseStats;
            for (let stat in base) {
                statsSum[stat] += base[stat];
            }
            count++;
        }
    });
    if (count === 0) return null;
    const avg = {};
    for (let stat in statsSum) {
        avg[stat] = Math.round(statsSum[stat] / count);
    }
    return avg;
}