(() => {
  let ctx = null;
  let musicInterval = null;
  let musicStep = 0;
  const muted = () => localStorage.getItem("choppy-muted") === "1";
  window.ArcadeAudio = {
    unlock() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!ctx) ctx = new AC({ latencyHint: "interactive" });
      if (ctx.state === "suspended") ctx.resume();
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        pickVoice();
      }
    },
    sfx: {}, speak() {}, cancelSpeech() {}, startMusic() {}, stopMusic() {},
  };
  function bus() { if (!ctx || muted()) return null; return ctx; }
  function beep(freq, dur, type, gain, slide, delay) {
    gain = gain == null ? 0.08 : gain; delay = delay || 0;
    const ac = bus(); if (!ac) return;
    const now = ac.currentTime + delay;
    const osc = ac.createOscillator(); const g = ac.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, now);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g); g.connect(ac.destination); osc.start(now); osc.stop(now + dur + 0.02);
  }
  const A = window.ArcadeAudio;
  A.sfx = {
    start: () => beep(220, 0.12, "square", 0.05),
    buy: () => { beep(440, 0.08, "square", 0.06); beep(660, 0.12, "triangle", 0.04); },
    sell: () => { beep(330, 0.08, "square", 0.06); beep(220, 0.14, "triangle", 0.04); },
    jump: () => beep(420, 0.09, "square", 0.05, 280),
    coin: () => beep(880, 0.07, "triangle", 0.045),
    hit: () => beep(90, 0.16, "sawtooth", 0.07, 50),
    die: () => beep(160, 0.35, "sawtooth", 0.08, 40),
    wave: () => beep(520, 0.18, "triangle", 0.05),
    power: () => beep(480, 0.14, "triangle", 0.05),
    count: () => beep(392, 0.12, "sine", 0.05),
    go: () => beep(523, 0.18, "triangle", 0.06),
    cap: () => {
      beep(523.25, 0.16, "sine", 0.05, undefined, 0);
      beep(659.25, 0.16, "sine", 0.05, undefined, 0.14);
      beep(783.99, 0.16, "sine", 0.05, undefined, 0.28);
      beep(1046.5, 0.42, "triangle", 0.06, undefined, 0.44);
    },
    boom: () => {
      const ac = bus();
      if (ac) {
        const now = ac.currentTime;
        const n = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.62), ac.sampleRate);
        const d = n.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const src = ac.createBufferSource(); src.buffer = n;
        const f = ac.createBiquadFilter(); f.type = "lowpass";
        f.frequency.setValueAtTime(1800, now);
        f.frequency.exponentialRampToValueAtTime(40, now + 0.52);
        const g = ac.createGain();
        g.gain.setValueAtTime(0.58, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
        src.connect(f); f.connect(g); g.connect(ac.destination); src.start(now);
      }
      beep(130, 0.32, "sawtooth", 0.2, 28);
      beep(55, 0.48, "square", 0.16, 18, 0.02);
      beep(38, 0.55, "sawtooth", 0.12, 16, 0.04);
    },
  };
  A.stopMusic = () => { if (musicInterval != null) { clearInterval(musicInterval); musicInterval = null; } };
  const BEAR = [98, 110, 87, 110, 73, 87, 65, 73];
  const BULL = [329, 392, 523, 659, 523, 659, 783, 1046];
  const IDLE = [146, 220, 293, 220, 164, 246, 329, 246];
  A.startMusic = (getPower, isPlaying) => {
    A.stopMusic(); musicStep = 0;
    musicInterval = setInterval(() => {
      if (!isPlaying()) return;
      const p = getPower();
      if (p === "BEAR") {
        beep(BEAR[musicStep % 8], 0.34, "sawtooth", 0.2);
        beep(BEAR[musicStep % 8] * 0.5, 0.4, "square", 0.1);
      } else if (p === "BULL") {
        beep(BULL[musicStep % 8], 0.2, "square", 0.16);
        beep(BULL[musicStep % 8] * 2, 0.12, "triangle", 0.07);
      } else beep(IDLE[musicStep % 8], 0.18, "sine", 0.032);
      musicStep++;
    }, 165);
  };
  A.SWAN = ["Black swan!","Cold storage lost!","oh oh, Funds not SAFU!","Coldcard randomness!","China ban!","in before oceans evaporation!","You got F. T. X.'d!"];
  A.BULL = ["Bull market!","To the moon!","We are SO back!","There is no second best","Luke, I am your spammer","Bitcoin C.E.O. to increase prices."];
  A.BEAR = ["Bear market! Crash!","quantum conundrum!","El Salvador all in ETH!","Bitcoin Depravement Proposals"];
  A.SELL = ["shame on you, nocoiner!","short it!"];
  let cachedVoice = null;
  function scoreVoice(v) {
    const n = (v.name || "").toLowerCase();
    const lang = (v.lang || "").toLowerCase();
    if (lang.startsWith("es")) return -1000;
    if (n.includes("spanish") || n.includes("español") || n.includes("mexico") || n.includes("argentina")) return -1000;
    let s = 0;
    if (lang.startsWith("en")) s += 40;
    if (lang === "en-us" || lang === "en_us") s += 20;
    if (n.includes("fred")) s += 120;
    if (n.includes("ralph")) s += 90;
    if (n.includes("daniel")) s += 70;
    if (n.includes("alex")) s += 45;
    if (n.includes("google us english")) s += 85;
    if (n.includes("english united states") || n.includes("us english")) s += 70;
    if (n.includes("google uk english male")) s += 75;
    if (n.includes("microsoft david") || n.includes("microsoft mark")) s += 55;
    if (n.includes("samsung") && n.includes("english")) s += 50;
    if (n.includes("compact") || n.includes("novelty") || n.includes("robot") || n.includes("espeak")) s += 40;
    if (n.includes("male")) s += 10;
    if (n.includes("female") || n.includes("samantha") || n.includes("zira") || n.includes("karen")) s -= 25;
    return s;
  }
  function pickVoice() {
    if (!window.speechSynthesis) return cachedVoice;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return cachedVoice;
    const ranked = voices.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a));
    const best = ranked[0] && scoreVoice(ranked[0]) > 0 ? ranked[0] : null;
    if (best) cachedVoice = best;
    return cachedVoice;
  }
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.addEventListener("voiceschanged", pickVoice);
    pickVoice();
  }
  A.cancelSpeech = () => { if (window.speechSynthesis) speechSynthesis.cancel(); };
  A.speak = (line, urgent) => {
    if (!window.speechSynthesis) return;
    if (urgent) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(line);
    u.lang = "en-US";
    u.rate = 0.78;
    u.pitch = 0.18;
    u.volume = 1;
    const v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang && v.lang.toLowerCase().startsWith("en") ? v.lang : "en-US"; }
    speechSynthesis.speak(u);
  };
})();
