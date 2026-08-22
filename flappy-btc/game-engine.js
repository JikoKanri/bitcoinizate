// GAME-ENGINE.JS - ARCHIVO 2 DE 3 (PARTE A): DISPARADORES DE EVENTOS
function resetGame() {
    btc.y = 250; btc.velocity = 0; pipes = []; items = []; pipeTimer = 0; chartOffset = 0;
    activePower = "NONE"; laserActive = false; powerTimer = 0; laserTimer = 0;
    coldStorageLives = 0; invulnerableTimer = 0; targetLineY = 300; currentLineY = 300;
    btcPrice = 25000; walletUSD = 1000.00; walletBTC = 0.00000000;
    
    document.body.className = "";
    const usdDisplay = document.getElementById("usd-display");
    const btcDisplay = document.getElementById("btc-display");
    const priceTicker = document.getElementById("price-ticker");
    const statusDisplay = document.getElementById("status-display");
    const coldStorageDisplay = document.getElementById("cold-storage-display");
    
    if (usdDisplay) usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";
    if (btcDisplay) btcDisplay.innerText = "HOLD: " + walletBTC.toFixed(8) + " BTC";
    if (priceTicker) priceTicker.innerText = "PRICE: $" + Math.floor(btcPrice);
    if (statusDisplay) statusDisplay.innerText = "";
    if (coldStorageDisplay) coldStorageDisplay.innerText = "COLD STORAGE: 0";
}

function startGame() {
    if (typeof currentUser === "undefined" || !currentUser) {
        const authModal = document.getElementById("auth-modal");
        if (authModal) authModal.style.display = "flex";
        return;
    }
    if (typeof initAudio === "function") initAudio();
    resetGame();
    const menuOverlay = document.getElementById("menu-overlay");
    if (menuOverlay) menuOverlay.style.display = "none";
    gameState = "PLAYING";
    if (typeof playTone === "function") playTone(440, "sine", 0.1);
    if (typeof startMusicSequencer === "function") startMusicSequencer(() => activePower, () => gameState);
    if (typeof speakDaftPunk === "function") speakDaftPunk("Welcome to choppy bitcoin: survive the market!");
}

function gameOver() {
    gameState = "GAMEOVER";
    if (typeof stopMusic === "function") stopMusic();
    if (typeof playTone === "function") playTone(120, "sawtooth", 0.5);
    if (typeof speakDaftPunk === "function") speakDaftPunk("Rekt! You got liquidated.");
    if (typeof submitNewHighScore === "function") submitNewHighScore(walletBTC);

    const menuText = document.getElementById("menu-text");
    const startTrigger = document.getElementById("start-trigger");
    const menuOverlay = document.getElementById("menu-overlay");
    
    if (menuText) menuText.innerHTML = "REKT!<br><br><span style='color:#FFF; font-size:0.9rem;'>LIQUIDATED</span><br><br>LEFT CASH: $" + walletUSD.toFixed(2) + " USD<br>FINAL HOLD: " + walletBTC.toFixed(8) + " BTC";
    if (startTrigger) startTrigger.innerText = "RESTART";
    if (menuOverlay) menuOverlay.style.display = "flex";
    document.body.className = "";
}
// GAME-ENGINE.JS - ARCHIVO 2 DE 3 (PARTE B): BUCLE DE ACTUALIZACIÓN DE FONDOS
function triggerRescue() {
    coldStorageLives--;
    const coldStorageDisplay = document.getElementById("cold-storage-display");
    if (coldStorageDisplay) coldStorageDisplay.innerText = "COLD STORAGE: " + coldStorageLives;
    invulnerableTimer = 90; btc.y = 300; btc.velocity = 0;
    if (typeof playTone === "function") {
        playTone(330, "triangle", 0.15, 0.15);
        setTimeout(() => playTone(660, "sine", 0.2, 0.1), 100);
    }
    if (typeof speakDaftPunk === "function") speakDaftPunk("Cold storage rescue!", true);
}

function update() {
    let currentSpeed = baseSpeed;
    const priceTicker = document.getElementById("price-ticker");
    const statusDisplay = document.getElementById("status-display");
    const usdDisplay = document.getElementById("usd-display");

    if (gameState === "PLAYING") {
        chartOffset += currentSpeed * 0.4;
        if (invulnerableTimer > 0) invulnerableTimer--;

        let statusText = "";
        if (activePower === "BULL") {
            currentSpeed = baseSpeed * 1.45; document.body.className = "bull-mode-global"; targetLineY = -100; 
            btcPrice += (125000 - btcPrice) * 0.02; statusText += "BULL RUN\n" + Math.ceil(powerTimer / 60) + "s ";
            powerTimer--; if (powerTimer <= 0) { activePower = "NONE"; document.body.className = ""; targetLineY = 300; }
        } else if (activePower === "BEAR") {
            currentSpeed = baseSpeed * 1.45; document.body.className = "bear-mode-global"; targetLineY = 700; 
            btcPrice += (8000 - btcPrice) * 0.03; statusText += "BEAR CRASH\n" + Math.ceil(powerTimer / 60) + "s ";
            powerTimer--; if (powerTimer <= 0) { activePower = "NONE"; document.body.className = ""; targetLineY = 300; }
        } else {
            targetLineY = 300; btcPrice += (28000 + Math.sin(chartOffset * 0.05) * 4500 - btcPrice) * 0.01; 
        }

        if (priceTicker) priceTicker.innerText = "PRICE: $" + Math.floor(btcPrice);
        if (laserActive) { statusText += "\n👁️LASER " + Math.ceil(laserTimer / 60) + "s"; laserTimer--; if (laserTimer <= 0) laserActive = false; }
        if (statusDisplay) {
            statusDisplay.innerText = statusText;
            if (activePower === "BULL") statusDisplay.style.color = "#00FF66";
            else if (activePower === "BEAR") statusDisplay.style.color = "#FF3333";
            else statusDisplay.style.color = "#33CCFF";
        }

        btc.velocity += btc.gravity; btc.y += btc.velocity;
        if (btc.y + btc.radius > canvas.height || btc.y - btc.radius < 0) {
            if (coldStorageLives > 0 && invulnerableTimer <= 0) triggerRescue(); else if (invulnerableTimer <= 0) gameOver();
        }

        pipeTimer++;
        if (pipeTimer % 95 === 0) {
            let topHeight = Math.floor(Math.random() * ((canvas.height - 280) - 60 + 1)) + 60;
            pipes.push({ x: canvas.width, top: topHeight, bottom: canvas.height - (topHeight + pipeGap), passed: false });

            if (Math.random() < 0.45) {
                let rand = Math.random(); let itemType = "BULL";
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
                walletUSD += 500.00;
                if (usdDisplay) usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";

                if (items[j].type === "SWAN") {
                    if (typeof playExplosionTone === "function") playExplosionTone();
                    if (activePower === "BULL") { activePower = "NONE"; document.body.className = ""; }
                    laserActive = false; if (typeof speakRandomSwan === "function") speakRandomSwan();
                    if (coldStorageLives > 0) {
                        coldStorageLives = 0;
                        const coldStorageDisplay = document.getElementById("cold-storage-display");
                        if (coldStorageDisplay) coldStorageDisplay.innerText = "COLD STORAGE: 0";
                    } else {
                        activePower = "BEAR"; powerTimer = 360; document.body.className = "bear-mode-global";
                    }
                } else if (items[j].type === "LASER") {
                    if (laserActive) laserTimer += 360; else { laserActive = true; laserTimer = 360; }
                    if (typeof playTone === "function") playTone(480, "triangle", 0.25);
                    if (typeof speakDaftPunk === "function") speakDaftPunk("L-L-LASER EYES!", true);
                } else if (items[j].type === "COLD") {
                    coldStorageLives++;
                    const coldStorageDisplay = document.getElementById("cold-storage-display");
                    if (coldStorageDisplay) coldStorageDisplay.innerText = "COLD STORAGE: " + coldStorageLives;
                    if (typeof playTone === "function") playTone(600, "sine", 0.2, 0.1);
                    if (typeof speakDaftPunk === "function") speakDaftPunk("Cold storage secured!");
                } else {
                    if (activePower === items[j].type) { powerTimer += 360; } 
                    else {
                        if (activePower === "BEAR" && items[j].type === "BULL") { activePower = "BULL"; powerTimer = 360; }
                        else if (activePower !== "BULL") {
                            activePower = items[j].type; powerTimer = 360;
                            if (activePower === "BULL") { 
                                if (typeof playTone === "function") playTone(550, "sine", 0.15); 
                                if (typeof speakDaftPunk === "function") speakDaftPunk("B-B-BULL MARKET!", true); 
                            } else { 
                                if (typeof playTone === "function") playTone(160, "sawtooth", 0.45); 
                                if (typeof speakDaftPunk === "function") speakDaftPunk("B-E-EAR MARKET! CRASH!", true); 
                            }
                        }
                    }
                }
                items.splice(j, 1); continue;
            }
            if (items[j].x < -35) items.splice(j, 1);
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= currentSpeed;
            if (btc.x + btc.radius > pipes[i].x && btc.x - btc.radius < pipes[i].x + animatedWidthWidth && (btc.y - btc.radius < pipes[i].top || btc.y + btc.radius > canvas.height - pipes[i].bottom)) {
                if (activePower === "BULL") {
                    pipes.splice(i, 1); walletUSD += 200.00; if (usdDisplay) usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";
                    if (typeof playTone === "function") playTone(720, "sine", 0.08, 0.1); continue;
                } else if (invulnerableTimer <= 0) {
                    if (coldStorageLives > 0) triggerRescue(); else gameOver();
                }
            }
            if (pipes[i] && !pipes[i].passed && pipes[i].x + animatedWidthWidth < btc.x) {
                pipes[i].passed = true; walletUSD += 100.00; if (usdDisplay) usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";
                if (typeof playTone === "function") playTone(880, "sine", 0.04);
            }
            if (pipes[i] && pipes[i].x + 65 < 0) pipes.splice(i, 1);
        }
    } else {
        chartOffset += baseSpeed * 0.4;
    }
    currentLineY += (targetLineY - currentLineY) * 0.05;
}

// Vinculación de listeners asíncronos seguros
const startTrigger = document.getElementById("start-trigger");
if (startTrigger) {
    startTrigger.addEventListener("click", triggerAction);
    startTrigger.addEventListener("touchstart", triggerAction, { passive: false });
}
const btnBuyMobile = document.getElementById("btn-buy-mobile");
if (btnBuyMobile) {
    btnBuyMobile.addEventListener("click", (e) => { e.stopPropagation(); executeBuy(); });
    btnBuyMobile.addEventListener("touchstart", (e) => { e.stopPropagation(); e.preventDefault(); executeBuy(); }, { passive: false });
}
const btnSellMobile = document.getElementById("btn-sell-mobile");
if (btnSellMobile) {
    btnSellMobile.addEventListener("click", (e) => { e.stopPropagation(); executeSell(); });
    btnSellMobile.addEventListener("touchstart", (e) => { e.stopPropagation(); e.preventDefault(); executeSell(); }, { passive: false });
}
const container = document.getElementById("game-container");
if (container) {
    container.addEventListener("touchstart", (e) => { if (document.activeElement.tagName === "INPUT") return; e.preventDefault(); jump(); }, { passive: false });
    container.addEventListener("mousedown", (e) => { if (document.activeElement.tagName === "INPUT") return; e.preventDefault(); jump(); });
}
