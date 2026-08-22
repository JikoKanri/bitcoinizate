// GAME-RENDER.JS - ARCHIVO 3 DE 3: PROCESAMIENTO VISUAL Y BUCLE PRINCIPAL
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- RENDERIZADO DEL CHART NEÓN HASTA LA MITAD ---
    ctx.beginPath(); ctx.strokeStyle = "rgba(242, 169, 0, 0.15)"; ctx.lineWidth = 3;
    let midPointX = canvas.width / 2; 
    for (let i = 0; i <= midPointX; i += 10) {
        let graphX = i; let globalX = i + chartOffset;
        let graphY = currentLineY + (Math.sin(globalX * 0.04) * 35) + (Math.cos(globalX * 0.01) * 15);
        if (i === 0) ctx.moveTo(graphX, graphY); else ctx.lineTo(graphX, graphY);
    }
    ctx.stroke();

    // Dibujado del Ticker Central Neón Móvil
    let currentTickerY = currentLineY + (Math.sin((midPointX + chartOffset) * 0.04) * 35) + (Math.cos((midPointX + chartOffset) * 0.01) * 15);
    ctx.beginPath(); ctx.arc(midPointX, currentTickerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = activePower === "BULL" ? "#00FF66" : (activePower === "BEAR" ? "#FF3333" : "#F2A900");
    ctx.shadowBlur = 15; ctx.shadowColor = ctx.fillStyle; ctx.fill(); ctx.shadowBlur = 0; 

    // Cuadrícula Reforzada
    ctx.strokeStyle = (activePower === "BEAR") ? "#4a1212" : (activePower === "BULL" ? "#124a12" : "#222244"); ctx.lineWidth = 1.2;
    for (let i = 0; i < canvas.width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let j = 0; j < canvas.height; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }

    if (gameState === "PLAYING") {
        let isBlinkingRed = (activePower === "BULL" && powerTimer < 120 && Math.floor(powerTimer / 10) % 2 === 0);
        pipes.forEach(p => {
            ctx.fillStyle = isBlinkingRed ? "#FF3333" : ((activePower === "BULL") ? "#00FF66" : "#FF3333");
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2;
            ctx.fillRect(p.x, 0, animatedWidthWidth, p.top); ctx.fillRect(p.x, canvas.height - p.bottom, animatedWidthWidth, p.bottom);
            ctx.strokeRect(p.x, 0, animatedWidthWidth, p.top); ctx.strokeRect(p.x, canvas.height - p.bottom, animatedWidthWidth, p.bottom);

            // MECHAS DECORATIVAS TRASPASABLES (WICKS)
            ctx.beginPath(); ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 2;
            let centerX = p.x + (animatedWidthWidth / 2);
            ctx.moveTo(centerX, p.top); ctx.lineTo(centerX, p.top + 35);
            ctx.moveTo(centerX, canvas.height - p.bottom); ctx.lineTo(centerX, canvas.height - p.bottom - 35);
            ctx.stroke();
        });

        items.forEach(it => {
            ctx.beginPath(); ctx.arc(it.x, it.y, it.radius, 0, Math.PI * 2);
            if (it.type === "BULL") ctx.fillStyle = "#00FF66"; if (it.type === "LASER") ctx.fillStyle = "#FF3333";
            if (it.type === "BEAR") ctx.fillStyle = "#FF3333"; if (it.type === "COLD") ctx.fillStyle = "#00CCFF";
            if (it.type === "SWAN") ctx.fillStyle = "#1e1e24";
            ctx.fill(); ctx.strokeStyle = (it.type === "SWAN") ? "#FF3333" : "#FFF"; ctx.lineWidth = it.type === "SWAN" ? 3 : 2; ctx.stroke();
            ctx.fillStyle = (it.type === "SWAN") ? "#FF3333" : "#000"; ctx.font = it.type === "SWAN" ? "bold 20px monospace" : "bold 14px monospace";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            let sym = it.type === "BULL" ? "▲" : (it.type === "LASER" ? "🕶" : (it.type === "BEAR" ? "▼" : (it.type === "COLD" ? "🔒" : "🦢")));
            ctx.fillText(sym, it.x, it.y);
        });

        if (invulnerableTimer === 0 || Math.floor(invulnerableTimer / 4) % 2 === 0) {
            ctx.beginPath(); ctx.arc(btc.x, btc.y, btc.radius, 0, Math.PI * 2); ctx.fillStyle = "#F2A900"; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = "#FFFFFF"; ctx.font = "bold 20px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("B", btc.x, btc.y + 1);
        }
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Ejecución inicial del hilo pasivo
loop();
