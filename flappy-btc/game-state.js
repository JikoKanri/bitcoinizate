// GAME-STATE.JS - ARCHIVO 1 DE 3: VARIABLES ECO-MAXIMALISTAS Y CAPTURA DE TECLAS
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

function executeBuy() {
    if (gameState !== "PLAYING" || walletUSD <= 0) return;
    let btcBought = walletUSD / btcPrice;
    walletBTC += btcBought;
    walletUSD = 0.00;
    const usdDisplay = document.getElementById("usd-display");
    const btcDisplay = document.getElementById("btc-display");
    if (usdDisplay) usdDisplay.innerText = "CASH: $0.00 USD";
    if (btcDisplay) btcDisplay.innerText = "HOLD: " + walletBTC.toFixed(8) + " BTC";
    if (typeof playTone === "function") playTone(587.33, "sine", 0.08, 0.1);
}

function executeSell() {
    if (gameState !== "PLAYING" || walletBTC <= 0) return;
    let usdGained = walletBTC * btcPrice;
    walletUSD += usdGained;
    walletBTC = 0.00000000;
    const usdDisplay = document.getElementById("usd-display");
    const btcDisplay = document.getElementById("btc-display");
    if (usdDisplay) usdDisplay.innerText = "CASH: $" + walletUSD.toFixed(2) + " USD";
    if (btcDisplay) btcDisplay.innerText = "HOLD: 0.00000000 BTC";
    if (typeof playTone === "function") playTone(880, "sine", 0.08, 0.1);
}

function jump() {
    if (gameState === "PLAYING") {
        btc.velocity = btc.jump;
        if (typeof playTone === "function") playTone(420, "square", 0.07);
    }
}

// --- DESBLOQUEO DEL TECLADO GARANTIZADO ---
window.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return; 
    }
    let key = e.key.toLowerCase();
    if (e.code === "Space" || e.key === " " || e.code === "ArrowUp" || key === "w") {
        e.preventDefault();
        jump();
    } else if (key === "b") {
        executeBuy();
    } else if (key === "s") {
        executeSell();
    }
}, { capture: true });
