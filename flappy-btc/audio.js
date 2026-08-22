// AUDIO.JS - MÓDULO SINTETIZADOR ACÚSTICO Y VOCÁLICO BLINDADO
let audioCtx = null;
let musicInterval = null;
let musicStep = 0;

// Lista de frases Daft Punk aleatorias para el Cisne Negro
const blackSwanPhrases = new Array(
    "Black swan!", "Cold storage lost!", "oh oh, Funds not SAFU!",
    "Coldcard randomness!", "China ban!", "in before oceans evaporation!", "You got FTX'd!"
);

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function speakDaftPunk(phrase, urgent = false) {
    try {
        window.speechSynthesis.cancel();
        let utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'en-US';
        utterance.pitch = urgent ? 0.6 : 0.45;
        utterance.rate = urgent ? 1.05 : 0.80;
        window.speechSynthesis.speak(utterance);
    } catch(e) {}
}

function speakRandomSwan() {
    let randPhrase = blackSwanPhrases[Math.floor(Math.random() * blackSwanPhrases.length)];
    speakDaftPunk(randPhrase, true);
}

function playTone(freq, type, duration, vol = 0.08) {
    if (!audioCtx) return;
    try {
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

function playExplosionTone() {
    if (!audioCtx) return;
    try {
        for (let i = 0; i < 6; i++) {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(100 - (i * 15), audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(30, audioCtx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        }
    } catch(e) {}
}

function stopMusic() {
    if (musicInterval) clearInterval(musicInterval);
}

function startMusicSequencer(getMarketState, getGameState) {
    if (musicInterval) clearInterval(musicInterval);
    musicInterval = setInterval(() => {
        if (getGameState() !== "PLAYING") return;
        
        let currentPower = getMarketState();
        if (currentPower === "BEAR") {
            let bearNotes = new Array(98, 110, 87, 110, 73, 87, 65, 73);
            playTone(bearNotes[musicStep % 8], "sawtooth", 0.22, 0.06);
        } else if (currentPower === "BULL") {
            let bullNotes = new Array(329, 392, 523, 659, 523, 659, 783, 1046);
            playTone(bullNotes[musicStep % 8], "square", 0.11, 0.04);
        } else {
            let normalNotes = new Array(146, 220, 293, 220, 164, 246, 329, 246);
            playTone(normalNotes[musicStep % 8], "sine", 0.18, 0.05);
        }
        musicStep++;
    }, 200);
}
