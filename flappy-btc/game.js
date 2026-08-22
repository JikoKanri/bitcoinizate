// GAME.JS - PARTE 1 DE 2: MOTOR FÍSICO ARCADE E INPUTS DE TRADING
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const container = document.getElementById("game-container");
const statusDisplay = document.getElementById("status-display");
const coldStorageDisplay = document.getElementById("cold-storage-display");
const menuOverlay = document.getElementById("menu-overlay");
const startTrigger = document.getElementById("start-trigger");
const versionDisplay = document.getElementById("version-display");

const usdDisplay = document.getElementById("usd-display");
const btcDisplay = document.getElementById("btc-display");
const priceTicker = document.getElementById("price-ticker");
const btnBuyMobile = document.getElementById("btn-buy-mobile");
const btnSellMobile = document.getElementById("btn-sell-mobile");

let gameState = "MENU";
let btcPrice = 25000;         
let walletUSD = 1000.00;      
let walletBTC = 0.00000000;   
let activePower = "NONE";
let laserActive = false;
let powerTimer = 0;
let laserTimer = 0;
let coldStorageLives = 0;
let invulnerableTimer = 0;

const btc = { x: 60, y: 250, radius: 18, velocity: 0, gravity: 0.38, jump: -6.8 };
let pipes = [];
let items = [];
const pipeWidth = 65;
let pipeGap = 160;
let baseSpeed = 2.6;
let pipeTimer = 0;
let animatedWidthWidth = 65;

let targetLineY = 300;
let currentLineY = 300;
let chartOffset = 0;

function resetGame() {
    btc.y = 250;
    btc.velocity = 0;
    pipes = [];
    items = [];
    pipeTimer = 0;
    chartOffset = 0;
    activePower = "NONE";
    laserActive = false;
    powerTimer = 0;
    laserTimer = 0;
    coldStorageLives = 0;
    invulnerableTimer = 0;
    targetLineY = 300;
    currentLineY = 300;
    
    btcPrice = 25000;
    walletUSD = 1000.00;
    walletBTC = 0.00000000;
    
    document.body.className = "";
    usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";
    btcDisplay.innerText = "HOLD: " + walletBTC.toFixed(8) + " BTC";
    priceTicker.innerText = "PRICE: $" + Math.floor(btcPrice);
    statusDisplay.innerText = "";
    coldStorageDisplay.innerText = "COLD STORAGE: 0";
}

function startGame() {
    // Lee de forma segura el usuario logueado en auth.js sin duplicar variables
    if (typeof currentUser === "undefined" || !currentUser) {
        const authModal = document.getElementById("auth-modal");
        if (authModal) authModal.style.display = "flex";
        return;
    }
    if (typeof initAudio === "function") initAudio();
    resetGame();
    menuOverlay.style.display = "none";
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
    
    if (typeof submitNewHighScore === "function") {
        submitNewHighScore(walletBTC);
    }
    document.getElementById("menu-text").innerHTML = "REKT!<br><br><span style='color:#FFF; font-size:0.9rem;'>LIQUIDATED</span><br><br>LEFT CASH: $" + walletUSD.toFixed(2) + " USD<br>FINAL HOLD: " + walletBTC.toFixed(8) + " BTC";
    startTrigger.innerText = "RESTART";
    menuOverlay.style.display = "flex";
    document.body.className = "";
}

function triggerRescue() {
    coldStorageLives--;
    coldStorageDisplay.innerText = "COLD STORAGE: " + coldStorageLives;
    invulnerableTimer = 90;
    btc.y = 300;
    btc.velocity = 0;
    if (typeof playTone === "function") {
        playTone(330, "triangle", 0.15, 0.15);
        setTimeout(() => playTone(660, "sine", 0.2, 0.1), 100);
    }
    if (typeof speakDaftPunk === "function") speakDaftPunk("Cold storage rescue!", true);
}

function executeBuy() {
    if (gameState !== "PLAYING" || walletUSD <= 0) return;
    let btcBought = walletUSD / btcPrice;
    walletBTC += btcBought;
    walletUSD = 0.00;
    usdDisplay.innerText = "CASH: $0.00 USD";
    btcDisplay.innerText = "HOLD: " + walletBTC.toFixed(8) + " BTC";
    if (typeof playTone === "function") playTone(587.33, "sine", 0.08, 0.1);
}

function executeSell() {
    if (gameState !== "PLAYING" || walletBTC <= 0) return;
    let usdGained = walletBTC * btcPrice;
    walletUSD += usdGained;
    walletBTC = 0.00000000;
    usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";
    btcDisplay.innerText = "HOLD: 0.00000000 BTC";
    if (typeof playTone === "function") playTone(880, "sine", 0.08, 0.1);
}

function jump() {
    if (gameState === "PLAYING") {
        btc.velocity = btc.jump;
        if (typeof playTone === "function") playTone(420, "square", 0.07);
    }
}

function triggerAction(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (gameState === "MENU" || gameState === "GAMEOVER") startGame();
    else if (gameState === "PLAYING") jump();
}

if (startTrigger) {
    startTrigger.addEventListener("click", triggerAction);
    startTrigger.addEventListener("touchstart", triggerAction, { passive: false });
}

if (btnBuyMobile) {
    btnBuyMobile.addEventListener("click", (e) => { e.stopPropagation(); executeBuy(); });
    btnBuyMobile.addEventListener("touchstart", (e) => { e.stopPropagation(); e.preventDefault(); executeBuy(); }, { passive: false });
}
if (btnSellMobile) {
    btnSellMobile.addEventListener("click", (e) => { e.stopPropagation(); executeSell(); });
    btnSellMobile.addEventListener("touchstart", (e) => { e.stopPropagation(); e.preventDefault(); executeSell(); }, { passive: false });
}

window.addEventListener("keydown", (e) => {
    let key = e.key.toLowerCase();
    if (e.code === "Space" || e.key === " " || e.code === "ArrowUp" || key === "w") {
        e.preventDefault();
        if (gameState === "PLAYING") jump();
    } else if (key === "b") {
        executeBuy();
    } else if (key === "s") {
        executeSell();
    }
}, { capture: true });

container.addEventListener("touchstart", (e) => { e.preventDefault(); if (gameState === "PLAYING") jump(); }, { passive: false });
container.addEventListener("mousedown", (e) => { e.preventDefault(); if (gameState === "PLAYING") jump(); });
// GAME.JS - PARTE 2 DE 2: PROCESAMIENTO DE CANVAS, MECHAS Y LOOP GENERAL
function update() {
    let currentSpeed = baseSpeed;
    if (gameState === "PLAYING") {
        chartOffset += currentSpeed * 0.4;
        if (invulnerableTimer > 0) invulnerableTimer--;

        let statusText = "";
        if (activePower === "BULL") {
            currentSpeed = baseSpeed * 1.45;
            document.body.className = "bull-mode-global";
            targetLineY = -100; 
            btcPrice += (125000 - btcPrice) * 0.02; 
            statusText += "BULL RUN\n" + Math.ceil(powerTimer / 60) + "s ";
            powerTimer--;
            if (powerTimer <= 0) { activePower = "NONE"; document.body.className = ""; targetLineY = 300; }
        } else if (activePower === "BEAR") {
            currentSpeed = baseSpeed * 1.45;
            document.body.className = "bear-mode-global";
            targetLineY = 700; 
            btcPrice += (8000 - btcPrice) * 0.03; 
            statusText += "BEAR CRASH\n" + Math.ceil(powerTimer / 60) + "s ";
            powerTimer--;
            if (powerTimer <= 0) { activePower = "NONE"; document.body.className = ""; targetLineY = 300; }
        } else {
            targetLineY = 300;
            btcPrice += (28000 + Math.sin(chartOffset * 0.05) * 4500 - btcPrice) * 0.01; 
        }

        priceTicker.innerText = "PRICE: $" + Math.floor(btcPrice);

        if (laserActive) {
            statusText += "\n👁️LASER " + Math.ceil(laserTimer / 60) + "s";
            laserTimer--;
            if (laserTimer <= 0) laserActive = false;
        }

        statusDisplay.innerText = statusText;
        if (activePower === "BULL") statusDisplay.style.color = "#00FF66";
        else if (activePower === "BEAR") statusDisplay.style.color = "#FF3333";
        else statusDisplay.style.color = "#33CCFF";

        btc.velocity += btc.gravity;
        btc.y += btc.velocity;
        if (btc.y + btc.radius > canvas.height || btc.y - btc.radius < 0) {
            if (coldStorageLives > 0 && invulnerableTimer <= 0) triggerRescue(); else if (invulnerableTimer <= 0) gameOver();
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
                walletUSD += 500.00;
                usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";

                if (items[j].type === "SWAN") {
                    if (typeof playExplosionTone === "function") playExplosionTone();
                    if (activePower === "BULL") { activePower = "NONE"; document.body.className = ""; }
                    laserActive = false;
                    if (typeof speakRandomSwan === "function") speakRandomSwan();
                    if (coldStorageLives > 0) {
                        coldStorageLives = 0;
                        coldStorageDisplay.innerText = "COLD STORAGE: 0";
                    } else {
                        activePower = "BEAR"; powerTimer = 360; document.body.className = "bear-mode-global";
                    }
                } else if (items[j].type === "LASER") {
                    if (laserActive) laserTimer += 360; else { laserActive = true; laserTimer = 360; }
                    if (typeof playTone === "function") playTone(480, "triangle", 0.25);
                    if (typeof speakDaftPunk === "function") speakDaftPunk("L-L-LASER EYES!", true);
                } else if (items[j].type === "COLD") {
                    coldStorageLives++;
                    coldStorageDisplay.innerText = "COLD STORAGE: " + coldStorageLives;
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
                    pipes.splice(i, 1); walletUSD += 200.00; usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";
                    if (typeof playTone === "function") playTone(720, "sine", 0.08, 0.1); continue;
                } else if (invulnerableTimer <= 0) {
                    if (coldStorageLives > 0) triggerRescue(); else gameOver();
                }
            }
            if (pipes[i] && !pipes[i].passed && pipes[i].x + animatedWidthWidth < btc.x) {
                pipes[i].passed = true; walletUSD += 100.00; usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";
                if (typeof playTone === "function") playTone(880, "sine", 0.04);
            }
            if (pipes[i] && pipes[i].x + 65 < 0) pipes.splice(i, 1);
        }
    } else {
        chartOffset += baseSpeed * 0.4;
    }
    currentLineY += (targetLineY - currentLineY) * 0.05;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath(); ctx.strokeStyle = "rgba(242, 169, 0, 0.15)"; ctx.lineWidth = 3;
    let midPointX = canvas.width / 2; 
    for (let i = 0; i <= midPointX; i += 10) {
        let graphX = i; let globalX = i + chartOffset;
        let graphY = currentLineY + (Math.sin(globalX * 0.04) * 35) + (Math.cos(globalX * 0.01) * 15);
        if (i === 0) ctx.moveTo(graphX, graphY); else ctx.lineTo(graphX, graphY);
    }
    ctx.stroke();

    let currentTickerY = currentLineY + (Math.sin((midPointX + chartOffset) * 0.04) * 35) + (Math.cos((midPointX + chartOffset) * 0.01) * 15);
    ctx.beginPath(); ctx.arc(midPointX, currentTickerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = activePower === "BULL" ? "#00FF66" : (activePower === "BEAR" ? "#FF3333" : "#F2A900");
    ctx.shadowBlur = 15; ctx.shadowColor = ctx.fillStyle; ctx.fill(); ctx.shadowBlur = 0; 

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
