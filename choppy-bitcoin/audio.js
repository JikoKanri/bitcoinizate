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
      if (window.speechSynthesis) window.speechSynthesis.getVoices();
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
        const n = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.38), ac.sampleRate);
        const d = n.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const src = ac.createBufferSource(); src.buffer = n;
        const f = ac.createBiquadFilter(); f.type = "lowpass";
        f.frequency.setValueAtTime(1100, now);
        f.frequency.exponentialRampToValueAtTime(70, now + 0.34);
        const g = ac.createGain();
        g.gain.setValueAtTime(0.24, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
        src.connect(f); f.connect(g); g.connect(ac.destination); src.start(now);
      }
      beep(95, 0.22, "sawtooth", 0.1, 38);
      beep(52, 0.34, "square", 0.07, 28, 0.03);
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
      if (p === "BEAR") beep(BEAR[musicStep % 8], 0.22, "sawtooth", 0.06);
      else if (p === "BULL") beep(BULL[musicStep % 8], 0.11, "square", 0.04);
      else beep(IDLE[musicStep % 8], 0.18, "sine", 0.05);
      musicStep++;
    }, 200);
  };
  A.SWAN = ["Black swan!","Cold storage lost!","oh oh, Funds not SAFU!","Coldcard randomness!","China ban!","in before oceans evaporation!","You got F. T. X.'d!"];
  function pickVoice() {
    if (!window.speechSynthesis) return null;
    const voices = speechSynthesis.getVoices();
    const en = voices.filter((v) => /^en([-_]|$)/i.test(v.lang));
    const rank = (v) => {
      const n = v.name.toLowerCase(); let s = 0;
      if (n.includes("fred")) s += 80;
      if (n.includes("daniel")) s += 55;
      if (n.includes("google uk english male")) s += 60;
      if (n.includes("google us english")) s += 50;
      if (n.includes("microsoft david")) s += 48;
      if (n.includes("male")) s += 12;
      if (/en-gb/i.test(v.lang)) s += 12;
      if (/^es/i.test(v.lang)) s -= 200;
      return s;
    };
    en.sort((a, b) => rank(b) - rank(a));
    return en[0] || null;
  }
  A.cancelSpeech = () => { if (window.speechSynthesis) speechSynthesis.cancel(); };
  A.speak = (line, urgent) => {
    if (!window.speechSynthesis) return;
    if (urgent) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(line);
    u.rate = 0.92; u.pitch = 0.55;
    const v = pickVoice(); if (v) u.voice = v;
    speechSynthesis.speak(u);
  };
})();
