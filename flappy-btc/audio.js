// GAME.JS - PARTE 2 DE 2: MOTOR DE RENDERS, EXPLOSIÓN DE FONDO Y CERRADO
function update() {
    if (gameState === "PLAYING") {
        let currentSpeed = baseSpeed;
        chartOffset += currentSpeed * 0.4;
        if (invulnerableTimer > 0) invulnerableTimer--;

        // --- DINÁMICA DEL CHART DE FONDO (SUBCIDAS/CAÍDAS EXTREMAS AL FILO) ---
        let statusText = "";
        if (activePower === "BULL") {
            currentSpeed = baseSpeed * 1.45;
            document.body.className = "bull-mode-global";
            targetLineY = -100; // El gráfico sube con violencia y desaparece por arriba del canvas
            statusText += "BULL RUN\n" + Math.ceil(powerTimer / 60) + "s ";
            powerTimer--;
            if (powerTimer <= 0) { activePower = "NONE"; document.body.className = ""; targetLineY = 300; }
        } else if (activePower === "BEAR") {
            currentSpeed = baseSpeed * 1.45;
            document.body.className = "bear-mode-global";
            targetLineY = 700; // El gráfico capitula con violencia y desaparece por debajo
            statusText += "BEAR CRASH\n" + Math.ceil(powerTimer / 60) + "s ";
            powerTimer--;
            if (powerTimer <= 0) { activePower = "NONE"; document.body.className = ""; targetLineY = 300; }
        } else {
            targetLineY = 300; // Regresa de forma suave al centro neutro
        }

        if (laserActive) {
            statusText += "\n👁️LASER " + Math.ceil(laserTimer / 60) + "s";
            laserTimer--;
            if (laserTimer <= 0) laserActive = false;
        }

        statusDisplay.innerText = statusText;
        if (activePower === "BULL") statusDisplay.style.color = "#00FF66";
        else if (activePower === "BEAR") statusDisplay.style.color = "#FF3333";
        else statusDisplay.style.color = "#33CCFF";

        currentLineY += (targetLineY - currentLineY) * 0.05; // Suavizado de la línea
        let targetWidth = laserActive ? 22 : 65;
        animatedWidthWidth += (targetWidth - animatedWidthWidth) * 0.08;

        btc.velocity += btc.gravity;
        btc.y += btc.velocity;
        if (btc.y + btc.radius > canvas.height || btc.y - btc.radius < 0) {
            if (coldStorageLives > 0 && invulnerableTimer <= 0) triggerRescue();
            else if (invulnerableTimer <= 0) gameOver();
        }

        pipeTimer++;
        if (pipeTimer % 95 === 0) {
            let topHeight = Math.floor(Math.random() * ((canvas.height - 280) - 60 + 1)) + 60;
            pipes.push({ x: canvas.width, top: topHeight, bottom: canvas.height - (topHeight + pipeGap), passed: false });

            if (Math.random() < 0.45) {
                let rand = Math.random();
                let itemType = "BULL";
                if (rand > 0.20 && rand < 0.40) itemType = "LASER";
                if (rand >= 0.40 && rand < 0.60) itemType = "BEAR";
                if (rand >= 0.60 && rand < 0.85) itemType = "COLD";
                if (rand >= 0.85) itemType = "SWAN";

                items.push({ x: canvas.width + 100, y: topHeight + 80, type: itemType, radius: itemType === "SWAN" ? 28 : 14 });
            }
        }

        for (let j = items.length - 1; j >= 0; j--) {
            items[j].x -= currentSpeed;
            if (Math.hypot(btc.x - items[j].x, btc.y - items[j].y) < btc.radius + items[j].radius) {
                
                // --- NUEVA LÓGICA RECTIFICADA DEL BLACK SWAN (CISNE NEGRO) ---
                if (items[j].type === "SWAN") {
                    playExplosionTone();
                    if (activePower === "BULL") { activePower = "NONE"; document.body.className = ""; }
                    laserActive = false; // Remueve ventajas positivas
                    speakRandomSwan();
                    
                    if (coldStorageLives > 0) {
                        coldStorageLives = 0; // Rompe el escudo vaciando el Cold Storage
                        coldStorageDisplay.innerText = "COLD STORAGE: 0";
                    } else {
                        // REGLA NUEVA: Si no hay Cold Storage, NO te mata. Te arrastra al BEAR CRASH agresivo.
                        activePower = "BEAR";
                        powerTimer = 360; 
                        document.body.className = "bear-mode-global";
                    }
                } else if (items[j].type === "LASER") {
                    if (laserActive) laserTimer += 360; else { laserActive = true; laserTimer = 360; }
                    playTone(480, "triangle", 0.25);
                    speakDaftPunk("L-L-LASER EYES!", true);
                } else if (items[j].type === "COLD") {
                    coldStorageLives++;
                    coldStorageDisplay.innerText = "COLD STORAGE: " + coldStorageLives;
                    playTone(600, "sine", 0.2, 0.1);
                    speakDaftPunk("Cold storage secured!");
                } else {
                    if (activePower === items[j].type) {
                        powerTimer += 360;
                        if (activePower === "BULL") speakDaftPunk("More green! Bull run extended!", true);
                    } else {
                        if (activePower === "BEAR" && items[j].type === "BULL") {
                            activePower = "BULL"; powerTimer = 360; speakDaftPunk("B-B-BULL MARKET!", true);
                        } else if (activePower !== "BULL") {
                            activePower = items[j].type; powerTimer = 360;
                            if (activePower === "BULL") { playTone(550, "sine", 0.15); speakDaftPunk("B-B-BULL MARKET!", true); }
                            else { playTone(160, "sawtooth", 0.45); speakDaftPunk("B-E-EAR MARKET! CRASH!", true); }
                        }
                    }
                }
                items.splice(j, 1);
                continue;
            }
            if (items[j].x < -35) items.splice(j, 1);
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= currentSpeed;
            if (btc.x + btc.radius > pipes[i].x && btc.x - btc.radius < pipes[i].x + animatedWidthWidth && (btc.y - btc.radius < pipes[i].top || btc.y + btc.radius > canvas.height - pipes[i].bottom)) {
                if (activePower === "BULL") {
                    pipes.splice(i, 1);
                    score += 2;
                    scoreDisplay.innerText = "SCORE: " + score;
                    playTone(720, "sine", 0.08, 0.1);
                    continue;
                } else if (invulnerableTimer <= 0) {
                    if (coldStorageLives > 0) triggerRescue(); else gameOver();
                }
            }
            if (pipes[i] && !pipes[i].passed && pipes[i].x + animatedWidthWidth < btc.x) {
                pipes[i].passed = true;
                score += 1;
                scoreDisplay.innerText = "SCORE: " + score;
                playTone(880, "sine", 0.04);
            }
            if (pipes[i] && pipes[i].x + 65 < 0) pipes.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- EL CHART NUNCA DESAPARECE, RESPONDE A LAS VELOCIDADES Y FÍSICAS ---
    ctx.beginPath();
    ctx.strokeStyle = "rgba(242, 169, 0, 0.15)";
    ctx.lineWidth = 3;
    for (let i = 0; i < canvas.width + 40; i += 10) {
        let graphX = i;
        let globalX = i + chartOffset;
        let graphY = currentLineY + (Math.sin(globalX * 0.04) * 35) + (Math.cos(globalX * 0.01) * 15);
        if (i === 0) ctx.moveTo(graphX, graphY); else ctx.lineTo(graphX, graphY);
    }
    ctx.stroke();

    ctx.strokeStyle = (activePower === "BEAR") ? "#351212" : (activePower === "BULL" ? "#123512" : "#121226");
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let j = 0; j < canvas.height; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }

    let isBlinkingRed = (activePower === "BULL" && powerTimer < 120 && Math.floor(powerTimer / 10) % 2 === 0);
    pipes.forEach(p => {
        ctx.fillStyle = isBlinkingRed ? "#FF3333" : ((activePower === "BULL") ? "#00FF66" : "#FF3333");
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;

        ctx.fillRect(p.x, 0, animatedWidthWidth, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, animatedWidthWidth, p.bottom);
        ctx.strokeRect(p.x, 0, animatedWidthWidth, p.top);
        ctx.strokeRect(p.x, canvas.height - p.bottom, animatedWidthWidth, p.bottom);

        // --- MECHAS DECORATIVAS (WICKS) ---
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 2;
        let centerX = p.x + (animatedWidthWidth / 2);
        ctx.moveTo(centerX, p.top); ctx.lineTo(centerX, p.top + 35);
        ctx.moveTo(centerX, canvas.height - p.bottom); ctx.lineTo(centerX, canvas.height - p.bottom - 35);
        ctx.stroke();
    });

    items.forEach(it => {
        ctx.beginPath();
        ctx.arc(it.x, it.y, it.radius, 0, Math.PI * 2);
        if (it.type === "BULL") ctx.fillStyle = "#00FF66";
        if (it.type === "LASER") ctx.fillStyle = "#FF3333";
        if (it.type === "BEAR") ctx.fillStyle = "#FF3333";
        if (it.type === "COLD") ctx.fillStyle = "#00CCFF";
        if (it.type === "SWAN") ctx.fillStyle = "#1e1e24";
        ctx.fill();
        ctx.strokeStyle = (it.type === "SWAN") ? "#FF3333" : "#FFF";
        ctx.lineWidth = it.type === "SWAN" ? 3 : 2;
        ctx.stroke();

        ctx.fillStyle = (it.type === "SWAN") ? "#FF3333" : "#000";
        ctx.font = it.type === "SWAN" ? "bold 20px monospace" : "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let sym = it.type === "BULL" ? "▲" : (it.type === "LASER" ? "🕶" : (it.type === "BEAR" ? "▼" : (it.type === "COLD" ? "🔒" : "🦢")));
        ctx.fillText(sym, it.x, it.y);
    });

    if (invulnerableTimer === 0 || Math.floor(invulnerableTimer / 4) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(btc.x, btc.y, btc.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#F2A900";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("B", btc.x, btc.y + 1);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
