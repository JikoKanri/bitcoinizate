(() => {
  const canvas = document.getElementById("c");
  const field = document.getElementById("field");
  const overlay = document.getElementById("overlay");
  const A = window.ArcadeAudio;
  const POWER_S = 6;
  const GREEN = "#4f9d6e";
  const RED = "#c45c4a";
  const BTC = "#c8960a";
  const KEY = "bitcoinizate-v1";

  const $ = (id) => document.getElementById(id);
  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const fmtBtc = (n) => (n >= 1e6 ? (n / 1e6).toFixed(2) + "M BTC" : n >= 100 ? n.toFixed(2) + " BTC" : n.toFixed(5) + " BTC");
  const fmtVt = (n) => (n >= 1000 ? n.toFixed(1) : n.toFixed(3)) + " VT";
  const fmtTime = (t) => {
    const s = Math.max(0, Math.floor(t));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };

  function loadBest() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      return (s.scores && s.scores.choppy) || 0;
    } catch (e) { return 0; }
  }
  function saveBest(n) {
    let s = { scores: { choppy: 0 } };
    try { s = Object.assign({ scores: { choppy: 0 } }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
    s.scores = s.scores || {};
    s.scores.choppy = Math.max(s.scores.choppy || 0, n);
    localStorage.setItem(KEY, JSON.stringify(s));
    return s.scores.choppy;
  }

  function gauss(mean, lo, hi) {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return Math.max(lo, Math.min(hi, mean + z * ((hi - lo) / 5)));
  }

  function pickItem() {
    const bag = ["BULL","BULL","BULL","BULL","BULL","BULL","BULL","BULL","BEAR","BEAR","BEAR","BEAR","BEAR","LASER","LASER","COLD","COLD","COLD","SWAN","SWAN","SWAN","SWAN"];
    return bag[(Math.random() * bag.length) | 0];
  }

  const S = {
    phase: "ready",
    countN: 3,
    speedMul: 1,
    W: 400, H: 640,
    bird: { x: 72, y: 280, v: 0, r: 14 },
    pipes: [], items: [], particles: [], floats: [],
    cash: 0, btc: 0, vt: 0, cold: 0, invuln: 0,
    power: "NONE", powerT: 0, laserOn: false, laserT: 0,
    widthMul: 1, widthT: 1, heightMul: 1, heightT: 1,
    price: 20000, vtPrice: 0,
    bg: 0, ticker: "", tickerT: 0,
    lastGapY: 0, spawnX: 0, best: loadBest(),
    dead: false, cycleStart: 20000, cycleDur: POWER_S, cycleElapsed: 0,
    vtCycle: 200, hitCap: false, lifeT: 0, sampleAcc: 0,
    tape: [], tapeVt: [], level: 1,
    startCash: 0, startPrice: 0, peakNet: 0, candles: 0, buys: 0, sells: 0, swans: 0,
    stats: null, welcomed: false, introCounted: false,
  };

  function net() { return S.cash + S.btc * S.price + S.vt * S.vtPrice; }

  function metrics() {
    const birdR = Math.min(17, Math.max(13, S.H * 0.021));
    const gapH = Math.min(S.H * 0.26, Math.max(132, birdR * 5.4));
    const pipeW = Math.min(56, Math.max(42, S.W * 0.12));
    const spacing = Math.min(230, Math.max(188, S.W * 0.46));
    const speed = Math.min(230, Math.max(170, S.W * 0.48));
    return { birdR, gapH, pipeW, spacing, speed, gravity: S.H * 1.62, jump: -S.H * 0.54, margin: Math.max(52, S.H * 0.085) };
  }

  function burst(x, y, color, n) {
    n = n || 10;
    for (let i = 0; i < n; i++) S.particles.push({ x, y, vx: (Math.random() - 0.5) * 180, vy: (Math.random() - 0.5) * 180 - 20, life: 0.35 + Math.random() * 0.3, color });
  }

  function pop(x, y, text, color) {
    S.floats.push({ x, y, text, color, life: 1.1, vy: -38 });
  }

  function fmtAmt(n, ticker) {
    if (ticker === "USD") return Math.round(n).toLocaleString("en-US") + " USD";
    if (ticker === "BTC") return (n >= 1 ? n.toFixed(4) : n.toFixed(6)) + " BTC";
    return (n >= 1 ? n.toFixed(3) : n.toFixed(4)) + " " + ticker;
  }

  function say(line, urgent) {
    S.ticker = line; S.tickerT = 2.4;
    A.speak(line, urgent);
  }

  function applyLaser(on) {
    S.laserOn = on;
    if (on) { S.laserT = POWER_S; S.widthT = 0.378; S.heightT = 0.9; }
    else { S.laserT = 0; S.widthT = 1; S.heightT = 1; }
  }

  function pipeEnds(p) {
    const top0 = p.gapY - p.gapH / 2;
    const bot0 = p.gapY + p.gapH / 2;
    return { top: top0 * S.heightMul, bot: S.H - (S.H - bot0) * S.heightMul };
  }

  function spawnPipe(x) {
    const m = metrics();
    const gapH = m.gapH;
    const minY = m.margin + gapH / 2;
    const maxY = S.H - m.margin - gapH / 2;
    let gapY;
    if (!S.pipes.length) gapY = S.bird.y + (Math.random() > 0.5 ? 1 : -1) * gapH * 0.28;
    else {
      const sign = Math.random() > 0.5 ? 1 : -1;
      gapY = S.lastGapY + sign * (0.42 + Math.random() * 0.42) * gapH;
    }
    gapY = Math.max(minY, Math.min(maxY, gapY));
    if (S.pipes.length && Math.abs(gapY - S.lastGapY) < gapH * 0.32) {
      gapY = S.lastGapY + (gapY >= S.lastGapY ? 1 : -1) * gapH * 0.4;
      gapY = Math.max(minY, Math.min(maxY, gapY));
    }
    S.lastGapY = gapY;
    S.pipes.push({ x, gapY, gapH, green: Math.random() > 0.45, scored: false });
    if (Math.random() < 0.48) {
      const type = pickItem();
      S.items.push({
        x: x + m.pipeW * S.widthMul * 0.5,
        y: gapY + (Math.random() * 2 - 1) * gapH * (type === "SWAN" ? 0.18 : 0.12),
        type, r: type === "SWAN" ? 17 : 14,
      });
    }
  }

  function resetWorld(keepWallet) {
    const m = metrics();
    S.bird.x = Math.max(64, S.W * 0.18);
    S.bird.y = S.H * 0.42;
    S.bird.v = 0;
    S.bird.r = m.birdR;
    S.pipes = []; S.items = []; S.particles = []; S.floats = [];
    if (!keepWallet) {
      S.cash = gauss(2000, 0, 4000);
      S.btc = 0; S.vt = 0; S.vtPrice = 0; S.level = 1; S.hitCap = false;
      S.price = gauss(20000, 0, 40000);
      S.startCash = S.cash; S.startPrice = S.price;
      S.peakNet = S.cash; S.candles = 0; S.buys = 0; S.sells = 0; S.swans = 0;
    }
    S.cold = 0; S.invuln = 0;
    S.power = "NONE"; S.powerT = 0;
    applyLaser(false);
    S.widthMul = S.heightMul = 1;
    S.bg = 0; S.ticker = ""; S.tickerT = 0;
    S.lastGapY = S.bird.y; S.dead = false;
    S.cycleStart = S.price; S.cycleDur = POWER_S; S.cycleElapsed = 0;
    S.lifeT = 0; S.sampleAcc = 0; S.tape = []; S.tapeVt = [];
    const first = S.bird.x + 210;
    spawnPipe(first); spawnPipe(first + m.spacing); spawnPipe(first + m.spacing * 2);
    S.spawnX = first + m.spacing * 2;
  }

  function beginCycle(type) {
    if (S.power === type) { S.powerT += POWER_S; S.cycleDur += POWER_S; return; }
    S.cycleStart = S.price; S.vtCycle = S.vtPrice;
    S.cycleDur = POWER_S; S.cycleElapsed = 0;
    S.power = type; S.powerT = POWER_S;
  }

  function endCycle() {
    if (S.power === "NONE") return;
    const dir = S.power === "BULL" ? 1 : -1;
    const residual = dir * (0.012 + Math.random() * 0.028);
    const wobble = (Math.random() - 0.4) * 0.035;
    S.price = Math.max(0.01, S.cycleStart * (1 + residual + wobble));
    if (S.level >= 2 && S.vtCycle > 0) S.vtPrice = Math.max(1, S.vtCycle * (1 + residual * 0.55 + wobble * 0.5));
    S.power = "NONE"; S.powerT = 0;
  }

  function collect(it) {
    const color = it.type === "BULL" ? GREEN : it.type === "BEAR" ? RED : it.type === "COLD" ? "#33c6e8" : it.type === "LASER" ? "#e8902a" : "#c9a0ff";
    burst(it.x, it.y, color, 12);
    S.cash += 500;
    pop(it.x, it.y - 18, "+500 usd", GREEN);
    if (it.type === "SWAN") {
      const pool = S.cold >= 1
        ? A.SWAN
        : A.SWAN.filter((l) => l !== "Cold storage lost!");
      const line = pool[(Math.random() * pool.length) | 0];
      S.ticker = line; S.tickerT = 2.4; A.speak(line, true);
      A.sfx.boom();
      if (S.power === "BULL") { S.power = "NONE"; S.powerT = 0; }
      applyLaser(false);
      if (S.cold > 0) S.cold = 0; else beginCycle("BEAR");
      return;
    }
    if (it.type === "LASER") {
      if (S.laserOn) S.laserT += POWER_S; else applyLaser(true);
      say("Laser eyes!", true); A.sfx.power(); return;
    }
    if (it.type === "COLD") { S.cold += 1; say("Cold storage secured!"); A.sfx.coin(); return; }
    beginCycle(it.type);
    if (it.type === "BULL") {
      const line = A.BULL[(Math.random() * A.BULL.length) | 0];
      say(line, true); A.sfx.wave();
    } else {
      const line = A.BEAR[(Math.random() * A.BEAR.length) | 0];
      say(line, true); A.sfx.hit();
    }
  }

  function rescue() {
    S.cold -= 1; S.invuln = 1.4;
    S.bird.v = metrics().jump * 0.7 * S.speedMul;
    S.bird.y = Math.min(Math.max(S.bird.y, 70), S.H - 70);
    say("Cold storage rescue!", true); A.sfx.coin();
    burst(S.bird.x, S.bird.y, "#33c6e8", 14);
  }

  function die() {
    if (S.dead || S.phase !== "play") return;
    S.dead = true; applyLaser(false); S.power = "NONE"; S.powerT = 0;
    A.sfx.die(); A.cancelSpeech(); A.speak("Rekt! You got liquidated.", true);
    S.best = saveBest(Math.round(net()));
    setPhase("over");
  }

  function flap() {
    if (S.phase !== "play") return;
    S.bird.v = metrics().jump * S.speedMul; A.sfx.jump();
  }
  function buyBtc() {
    if (S.phase !== "play" || S.cash <= 0 || S.price <= 0) return;
    const usd = S.cash, got = usd / S.price;
    S.btc += got; S.cash = 0; S.buys++; A.sfx.buy();
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(got, "BTC"), GREEN);
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(usd, "USD"), RED);
  }
  function sellBtc() {
    if (S.phase !== "play" || S.btc <= 0) return;
    const btc = S.btc, usd = btc * S.price;
    S.cash += usd; S.btc = 0; S.sells++; A.sfx.sell();
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(usd, "USD"), GREEN);
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(btc, "BTC"), RED);
  }
  function buyVt() {
    if (S.phase !== "play" || S.level < 2 || S.cash <= 0 || S.vtPrice <= 0) return;
    const usd = S.cash, got = usd / S.vtPrice;
    S.vt += got; S.cash = 0; S.buys++; A.sfx.buy();
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(got, "VT"), GREEN);
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(usd, "USD"), RED);
  }
  function sellVt() {
    if (S.phase !== "play" || S.level < 2 || S.vt <= 0) return;
    const vt = S.vt, usd = vt * S.vtPrice;
    S.cash += usd; S.vt = 0; S.sells++; A.sfx.sell();
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(usd, "USD"), GREEN);
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(vt, "VT"), RED);
  }
  function togglePause() {
    if (S.phase === "play") setPhase("paused");
    else if (S.phase === "paused") setPhase("play");
  }
  function continueBonus() {
    S.level = 2;
    S.vtPrice = 100 + Math.random() * 200;
    S.vt = 0; S.vtCycle = S.vtPrice;
    resetWorld(true);
    startCount();
  }

  let countTimer = 0;
  function startCount() {
    S.countN = 3; setPhase("count"); A.sfx.count();
    clearInterval(countTimer);
    countTimer = setInterval(() => {
      S.countN -= 1;
      if (S.countN <= 0) { clearInterval(countTimer); A.sfx.go(); setPhase("play"); }
      else { A.sfx.count(); renderOverlay(); }
    }, 1000);
  }

  function setPhase(p) {
    S.phase = p;
    if (p === "play") A.startMusic(() => S.power, () => S.phase === "play");
    else A.stopMusic();
    field.classList.toggle("bull", S.power === "BULL");
    field.classList.toggle("bear", S.power === "BEAR");
    renderOverlay();
    renderHud();
  }

  function startGame() {
    A.unlock(); A.sfx.start();
    if (!S.welcomed) { A.speak("Welcome to choppy bitcoin: survive the market!"); S.welcomed = true; }
    resetWorld(false);
    if (!S.introCounted) { S.introCounted = true; startCount(); }
    else setPhase("play");
  }

  function replay() {
    A.cancelSpeech();
    resetWorld(false);
    setPhase("play");
  }

  function step(dt) {
    const m = metrics();
    S.bird.r = m.birdR;
    S.bg += m.speed * 0.35 * dt;
    S.widthMul += (S.widthT - S.widthMul) * Math.min(1, 1.7 * dt);
    S.heightMul += (S.heightT - S.heightMul) * Math.min(1, 1.7 * dt);
    if (S.tickerT > 0) { S.tickerT -= dt; if (S.tickerT <= 0) S.ticker = ""; }
    for (const p of S.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 420 * dt; p.life -= dt; }
    S.particles = S.particles.filter((p) => p.life > 0);
    for (const f of S.floats) { f.y += f.vy * dt; f.life -= dt; }
    S.floats = S.floats.filter((f) => f.life > 0);
    if (S.phase !== "play") return;
    if (S.invuln > 0) S.invuln -= dt;

    let speed = m.speed * S.speedMul;
    if (S.power === "BULL" || S.power === "BEAR" || S.laserOn) speed *= 1.28;
    if (S.power === "BULL" || S.power === "BEAR") {
      S.powerT -= dt; S.cycleElapsed += dt;
      const u = Math.min(1, S.cycleElapsed / Math.max(0.001, S.cycleDur));
      const envelope = Math.sin(Math.PI * u);
      const dir = S.power === "BULL" ? 1 : -1;
      const wobble = Math.sin(S.cycleElapsed * 3.2) * 0.012;
      S.price = Math.max(0.01, S.cycleStart * (1 + dir * 0.11 * envelope + wobble));
      if (S.level >= 2) S.vtPrice = Math.max(1, S.vtCycle * (1 + dir * 0.05 * envelope + wobble * 0.45));
      if (S.powerT <= 0) endCycle();
    } else {
      S.price = Math.max(0.01, S.price + (Math.random() - 0.5) * S.price * 0.012 * dt);
      if (S.level >= 2) S.vtPrice = Math.max(1, S.vtPrice + (Math.random() - 0.5) * S.vtPrice * 0.01 * dt);
    }
    S.lifeT += dt; S.sampleAcc += dt;
    while (S.sampleAcc >= 0.12) {
      S.tape.push(S.price);
      if (S.level >= 2) S.tapeVt.push(S.vtPrice);
      S.sampleAcc -= 0.12;
    }
    if (!S.hitCap && S.btc >= 21e6) {
      S.hitCap = true; A.sfx.cap();
      A.speak("Twenty one million. Go full Boglehead. Buy VT.", true);
      S.stats = { time: S.lifeT, startCash: S.startCash, startPrice: S.startPrice, peakNet: S.peakNet, candles: S.candles, buys: S.buys, sells: S.sells, swans: S.swans, endCash: S.cash, endBtc: S.btc, endPrice: S.price, net: net() };
      setPhase("level");
      return;
    }
    if (S.laserOn) { S.laserT -= dt; if (S.laserT <= 0) applyLaser(false); }
    S.bird.v += m.gravity * S.speedMul * dt; S.bird.y += S.bird.v * dt;
    if (S.bird.y + S.bird.r > S.H - 4) {
      S.bird.y = S.H - 4 - S.bird.r;
      if (S.invuln <= 0) { if (S.cold > 0) rescue(); else die(); }
    }
    if (S.bird.y - S.bird.r < 0) { S.bird.y = S.bird.r; S.bird.v = 0; }

    const pw = m.pipeW * S.widthMul;
    if (!S.pipes.length || S.spawnX - S.pipes[S.pipes.length - 1].x >= m.spacing) {
      const nx = S.pipes.length ? S.pipes[S.pipes.length - 1].x + m.spacing : S.W + 40;
      spawnPipe(nx); S.spawnX = nx;
    }
    const hitR = S.bird.r * 0.78;
    for (let i = S.pipes.length - 1; i >= 0; i--) {
      const p = S.pipes[i];
      p.x -= speed * dt;
      if (!p.scored && p.x + pw < S.bird.x) {
        p.scored = true; S.cash += 100; S.candles++; A.sfx.coin();
        pop(p.x + pw * 0.5, p.gapY, "+100 usd", GREEN);
      }
      const inX = S.bird.x + hitR > p.x + 2 && S.bird.x - hitR < p.x + pw - 2;
      if (inX) {
        const ends = pipeEnds(p);
        if (S.bird.y - hitR < ends.top + 2 || S.bird.y + hitR > ends.bot - 2) {
          if (S.power === "BULL") { burst(p.x + pw * 0.5, S.bird.y, GREEN, 8); A.sfx.wave(); S.cash += 200; pop(p.x + pw * 0.5, S.bird.y - 16, "+200 usd", GREEN); S.pipes.splice(i, 1); continue; }
          else if (S.invuln <= 0) { if (S.cold > 0) rescue(); else die(); }
        }
      }
      if (p.x + pw < -60) S.pipes.splice(i, 1);
    }
    for (let j = S.items.length - 1; j >= 0; j--) {
      const it = S.items[j];
      it.x -= speed * dt;
      if (S.laserOn && it.type === "SWAN" && it.x > S.bird.x - 8 && Math.abs(it.y - S.bird.y) < it.r + 14) {
        burst(it.x, it.y, "#e8902a", 16); A.sfx.wave(); S.swans++; say("Black swan vaporized!", true);
        S.items.splice(j, 1); continue;
      }
      const dx = S.bird.x - it.x, dy = S.bird.y - it.y;
      if (dx * dx + dy * dy < (hitR + it.r) * (hitR + it.r)) { collect(it); S.items.splice(j, 1); continue; }
      if (it.x < -40) S.items.splice(j, 1);
    }
    const n = net();
    if (n > S.peakNet) S.peakNet = n;
    field.classList.toggle("bull", S.power === "BULL");
    field.classList.toggle("bear", S.power === "BEAR");
  }

  function drawPowerIcon(ctx, it, wash) {
    const r = it.r;
    const pal = {
      BULL: { fill: "#1f8a4c", ring: "#9dffc4", ink: "#04150c" },
      BEAR: { fill: "#a33a32", ring: "#ff9b92", ink: "#1a0605" },
      LASER: { fill: "#c56a12", ring: "#ffd59a", ink: "#1a0e04" },
      COLD: { fill: "#1788a6", ring: "#9befff", ink: "#041318" },
      SWAN: { fill: "#161218", ring: "#f0e6f0", ink: "#f3efe6" },
    }[it.type];
    const fill = wash || pal.fill;
    const ring = wash || pal.ring;
    const ink = wash ? "#04150c" : pal.ink;
    ctx.save();
    ctx.translate(it.x, it.y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = ring; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.beginPath(); ctx.arc(-r * 0.28, -r * 0.3, r * 0.34, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.fill();
    ctx.fillStyle = ink; ctx.strokeStyle = ink; ctx.lineWidth = 1.7; ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (it.type === "BULL") {
      ctx.lineWidth = Math.max(2, r * 0.16);
      ctx.beginPath(); ctx.arc(-r * 0.06, r * 0.18, r * 0.5, -Math.PI * 0.92, -Math.PI * 0.18); ctx.stroke();
      ctx.beginPath(); ctx.arc(r * 0.06, r * 0.18, r * 0.5, Math.PI * 1.18, Math.PI * 0.08, true); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, r * 0.22, r * 0.34, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(0, r * 0.32, r * 0.16, r * 0.11, 0, 0, Math.PI * 2); ctx.fill();
    } else if (it.type === "BEAR") {
      ctx.beginPath(); ctx.arc(-r * 0.36, -r * 0.28, r * 0.22, 0, Math.PI * 2); ctx.arc(r * 0.36, -r * 0.28, r * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, r * 0.08, r * 0.46, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.arc(-r * 0.36, -r * 0.28, r * 0.1, 0, Math.PI * 2); ctx.arc(r * 0.36, -r * 0.28, r * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, r * 0.22, r * 0.22, r * 0.14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(0, r * 0.18, r * 0.07, 0, Math.PI * 2); ctx.fill();
    } else if (it.type === "LASER") {
      ctx.lineWidth = Math.max(2.4, r * 0.2);
      ctx.beginPath(); ctx.moveTo(-r * 0.82, 0); ctx.lineTo(-r * 0.32, 0); ctx.moveTo(r * 0.32, 0); ctx.lineTo(r * 0.82, 0); ctx.stroke();
      ctx.fillStyle = "#f3efe6"; ctx.beginPath(); ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e8902a"; ctx.beginPath(); ctx.arc(r * 0.05, 0, r * 0.07, 0, Math.PI * 2); ctx.fill();
    } else if (it.type === "COLD") {
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang) * r * 0.54, Math.sin(ang) * r * 0.54); ctx.stroke();
        const bx = Math.cos(ang) * r * 0.3, by = Math.sin(ang) * r * 0.3;
        ctx.beginPath();
        ctx.moveTo(bx + Math.cos(ang + 0.85) * r * 0.16, by + Math.sin(ang + 0.85) * r * 0.16);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + Math.cos(ang - 0.85) * r * 0.16, by + Math.sin(ang - 0.85) * r * 0.16);
        ctx.stroke();
      }
    } else {
      ctx.beginPath(); ctx.ellipse(r * 0.06, r * 0.2, r * 0.4, r * 0.26, -0.28, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-r * 0.02, r * 0.06); ctx.quadraticCurveTo(-r * 0.42, -r * 0.32, -r * 0.04, -r * 0.5); ctx.quadraticCurveTo(r * 0.16, -r * 0.52, r * 0.22, -r * 0.38);
      ctx.strokeStyle = ink; ctx.lineWidth = 2.3; ctx.stroke();
      ctx.fillStyle = wash ? ink : RED;
      ctx.beginPath(); ctx.moveTo(r * 0.18, -r * 0.42); ctx.lineTo(r * 0.46, -r * 0.36); ctx.lineTo(r * 0.18, -r * 0.3); ctx.fill();
    }
    ctx.restore();
  }

  function drawTape(ctx, data, y0, y1, up, dn) {
    if (data.length < 2) return;
    const bucket = 6, cw = 3, stepX = 4;
    const maxFit = Math.max(8, Math.floor((S.W * 0.62) / stepX));
    const buckets = [];
    for (let i = 0; i < data.length; i += bucket) {
      const sl = data.slice(i, i + bucket);
      if (!sl.length) continue;
      buckets.push({ o: sl[0], h: Math.max.apply(null, sl), l: Math.min.apply(null, sl), c: sl[sl.length - 1] });
    }
    const vis = buckets.length > maxFit ? buckets.slice(buckets.length - maxFit) : buckets;
    if (!vis.length) return;
    let lo = vis[0].l, hi = vis[0].h;
    for (const b of vis) { if (b.l < lo) lo = b.l; if (b.h > hi) hi = b.h; }
    if (hi - lo < 1) { lo -= 1; hi += 1; }
    const py = (v) => y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
    vis.forEach((b, i) => {
      const x = 10 + i * stepX;
      ctx.strokeStyle = b.c >= b.o ? up : dn; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + cw / 2, py(b.h)); ctx.lineTo(x + cw / 2, py(b.l)); ctx.stroke();
      ctx.fillStyle = b.c >= b.o ? up : dn;
      ctx.fillRect(x, Math.min(py(b.o), py(b.c)), cw, Math.max(1, Math.abs(py(b.c) - py(b.o))));
    });
  }

  function draw(ctx) {
    const wash = S.power === "BULL" ? GREEN : S.power === "BEAR" ? RED : null;
    ctx.fillStyle = S.power === "BULL" ? "#052010" : S.power === "BEAR" ? "#200505" : "#0a0a0c";
    ctx.fillRect(0, 0, S.W, S.H);
    ctx.strokeStyle = wash ? (wash === GREEN ? "rgba(79,157,110,0.38)" : "rgba(196,92,74,0.38)") : "rgba(243,239,230,0.16)";
    ctx.lineWidth = 1;
    const stepG = 36, ox = -((S.bg * 0.5) % stepG);
    for (let x = ox; x < S.W + stepG; x += stepG) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S.H); ctx.stroke(); }
    for (let y = 0; y < S.H; y += stepG) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S.W, y); ctx.stroke(); }
    if (S.level >= 2) {
      drawTape(ctx, S.tape, S.H * 0.14, S.H * 0.38, "rgba(79,157,110,0.2)", "rgba(196,92,74,0.2)");
      drawTape(ctx, S.tapeVt, S.H * 0.52, S.H * 0.76, "rgba(90,140,190,0.22)", "rgba(196,92,74,0.2)");
    } else drawTape(ctx, S.tape, S.H * 0.3, S.H * 0.7, "rgba(79,157,110,0.18)", "rgba(196,92,74,0.18)");

    const m = metrics();
    const pw = m.pipeW * S.widthMul;
    const endingFlash = S.power === "BULL" && S.powerT < 1.15 && Math.floor(S.powerT * 9) % 2 === 0;
    const edge = wash || (S.laserOn ? "#e8902a" : "rgba(243,239,230,0.85)");
    for (const p of S.pipes) {
      const col = endingFlash ? RED : wash || (p.green ? GREEN : RED);
      const ends = pipeEnds(p);
      ctx.fillStyle = col; ctx.strokeStyle = edge; ctx.lineWidth = S.laserOn ? 2.4 : 1.6;
      ctx.fillRect(p.x, 0, pw, ends.top); ctx.strokeRect(p.x + 0.5, 0.5, pw - 1, Math.max(0, ends.top - 1));
      ctx.fillRect(p.x, ends.bot, pw, S.H - ends.bot); ctx.strokeRect(p.x + 0.5, ends.bot + 0.5, pw - 1, Math.max(0, S.H - ends.bot - 1));
      const mx = p.x + pw * 0.5, wick = Math.min(22, p.gapH * 0.14);
      ctx.beginPath(); ctx.strokeStyle = wash ? wash : S.laserOn ? "rgba(232,144,42,0.75)" : "rgba(243,239,230,0.5)"; ctx.lineWidth = 2;
      ctx.moveTo(mx, ends.top); ctx.lineTo(mx, ends.top + wick); ctx.moveTo(mx, ends.bot); ctx.lineTo(mx, ends.bot - wick); ctx.stroke();
    }
    for (const it of S.items) drawPowerIcon(ctx, it, wash);
    const blink = S.invuln > 0 && Math.floor(S.invuln * 10) % 2 === 0;
    if (!blink) {
      const col = wash || (S.laserOn ? "#e8902a" : BTC);
      ctx.save(); ctx.translate(S.bird.x, S.bird.y);
      ctx.rotate(Math.max(-0.65, Math.min(0.95, S.bird.v * 0.0022)));
      ctx.beginPath(); ctx.arc(0, 0, S.bird.r, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#09090b"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#09090b"; ctx.font = "700 " + Math.round(S.bird.r) + "px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("B", 0, 1);
      if (S.laserOn) {
        ctx.strokeStyle = wash || "rgba(255,150,40,0.78)"; ctx.lineWidth = 3.4;
        ctx.beginPath(); ctx.moveTo(S.bird.r - 2, -3); ctx.lineTo(S.W - S.bird.x + 80, -8);
        ctx.moveTo(S.bird.r - 2, 3); ctx.lineTo(S.W - S.bird.x + 80, 8); ctx.stroke();
      }
      ctx.restore();
    }
    for (const pt of S.particles) {
      ctx.globalAlpha = Math.max(0, pt.life / 0.5);
      ctx.fillStyle = wash || pt.color; ctx.fillRect(pt.x, pt.y, 3, 3);
    }
    ctx.font = "700 13px \"IBM Plex Mono\", monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const f of S.floats) {
      ctx.globalAlpha = Math.max(0, Math.min(1, f.life / 0.35));
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    if (wash) {
      ctx.fillStyle = wash === GREEN ? "rgba(20,90,40,0.22)" : "rgba(90,20,18,0.22)";
      ctx.fillRect(0, 0, S.W, S.H);
    }
    ctx.fillStyle = wash || BTC; ctx.fillRect(0, S.H - 3, S.W, 3);
  }

  function fit() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.parentElement.getBoundingClientRect();
    S.W = Math.max(280, r.width); S.H = Math.max(320, r.height);
    canvas.width = S.W * dpr; canvas.height = S.H * dpr;
    canvas.style.width = S.W + "px"; canvas.style.height = S.H + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function renderHud() {
    $("h-cash").textContent = money(S.cash);
    $("h-btc").textContent = fmtBtc(S.btc);
    $("h-price").textContent = money(S.price);
    $("h-cold").textContent = String(S.cold);
    $("h-vt").textContent = fmtVt(S.vt);
    $("h-vtpx").textContent = money(S.vtPrice);
    const bonus = S.level >= 2;
    $("hud").className = "hud-grid " + (bonus ? "hud-3" : "hud-4");
    $("h-vt-wrap").classList.toggle("hide", !bonus);
    $("h-vtpx-wrap").classList.toggle("hide", !bonus);
    $("vt-row").classList.toggle("hide", !bonus);
    const playing = S.phase === "play" || S.phase === "paused";
    $("trades").classList.toggle("hide", !playing);
    $("pause-btn").classList.toggle("hide", !playing);
    let status = "";
    if (S.power === "BULL") status = "BULL RUN  " + Math.ceil(S.powerT) + "s";
    else if (S.power === "BEAR") status = "BEAR CRASH  " + Math.ceil(S.powerT) + "s";
    if (S.laserOn) status = status ? status + "  ·  LASER " + Math.ceil(S.laserT) + "s" : "LASER  " + Math.ceil(S.laserT) + "s";
    $("status").textContent = status;
    $("status").classList.toggle("hide", !(status && S.phase === "play"));
    $("ticker").textContent = S.ticker;
    $("ticker").classList.toggle("hide", !(S.ticker && S.phase === "play"));
  }

  function renderOverlay() {
    const p = S.phase;
    if (p === "play") { overlay.classList.add("hide"); overlay.innerHTML = ""; return; }
    overlay.classList.remove("hide");
    if (p === "ready") {
      overlay.innerHTML = "<h1>Choppy Bitcoin</h1><p>Flap the candles. Buy dips, sell rips. Net worth in USD is the score.</p><button class=\"cta\" id=\"go\">Start</button>";
      $("go").onclick = startGame;
    } else if (p === "count") {
      overlay.innerHTML = "<p class=\"count\">" + S.countN + "</p>";
    } else if (p === "paused") {
      overlay.innerHTML = "<h1>Paused</h1><button class=\"cta\" id=\"go\">Resume</button>";
      $("go").onclick = () => setPhase("play");
    } else if (p === "over") {
      overlay.innerHTML = "<p class=\"k\">Rekt · net worth</p><h1>" + money(net()) + "</h1><p>" + money(S.cash) + " + " + fmtBtc(S.btc) + " x " + money(S.price) + (S.level >= 2 ? " + " + fmtVt(S.vt) + " x " + money(S.vtPrice) : "") + "</p><p class=\"k\">Best " + money(S.best) + "</p><button class=\"cta\" id=\"go\">Try again</button>";
      $("go").onclick = replay;
    } else if (p === "level" && S.stats) {
      const st = S.stats;
      overlay.innerHTML = "<p class=\"k\">TRACK COMPLETE</p><h1>Go full Boglehead</h1><p>Twenty one million bitcoin. The float is yours. Next: own the world. Buy VT.</p><ul>"
        + "<li><span class=\"k\">Time</span><span>" + fmtTime(st.time) + "</span></li>"
        + "<li><span class=\"k\">Start cash</span><span>" + money(st.startCash) + "</span></li>"
        + "<li><span class=\"k\">Start BTC px</span><span>" + money(st.startPrice) + "</span></li>"
        + "<li><span class=\"k\">Peak net</span><span>" + money(st.peakNet) + "</span></li>"
        + "<li><span class=\"k\">Net worth</span><span>" + money(st.net) + "</span></li>"
        + "<li><span class=\"k\">BTC held</span><span>" + fmtBtc(st.endBtc) + "</span></li>"
        + "<li><span class=\"k\">Candles</span><span>" + st.candles + "</span></li>"
        + "<li><span class=\"k\">Buys / sells</span><span>" + st.buys + " / " + st.sells + "</span></li>"
        + "<li><span class=\"k\">Swans vaporized</span><span>" + st.swans + "</span></li></ul>"
        + "<button class=\"cta\" id=\"go\">Bonus track · VT</button>";
      $("go").onclick = continueBonus;
    }
  }

  let last = performance.now(), acc = 0, hudAcc = 0;
  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now; acc += dt; hudAcc += dt;
    const ctx = fit();
    while (acc >= 1 / 60) { step(1 / 60); acc -= 1 / 60; }
    draw(ctx);
    if (hudAcc > 0.12) { renderHud(); hudAcc = 0; }
    requestAnimationFrame(loop);
  }

  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault(); A.unlock();
    if (S.phase === "play") flap();
  });
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); if (!e.repeat) flap(); }
    else if (k === "b") { e.preventDefault(); buyBtc(); }
    else if (k === "s") { e.preventDefault(); sellBtc(); }
    else if (k === "v") { e.preventDefault(); buyVt(); }
    else if (k === "n") { e.preventDefault(); sellVt(); }
    else if (k === "p") { e.preventDefault(); togglePause(); }
  });
  $("buy-btc").onpointerdown = (e) => { e.stopPropagation(); e.preventDefault(); buyBtc(); };
  $("sell-btc").onpointerdown = (e) => { e.stopPropagation(); e.preventDefault(); sellBtc(); };
  $("buy-vt").onpointerdown = (e) => { e.stopPropagation(); e.preventDefault(); buyVt(); };
  $("sell-vt").onpointerdown = (e) => { e.stopPropagation(); e.preventDefault(); sellVt(); };
  $("pause-btn").onpointerdown = (e) => { e.stopPropagation(); e.preventDefault(); togglePause(); };
  document.querySelectorAll(".spd").forEach((btn) => {
    btn.onpointerdown = (e) => {
      e.stopPropagation(); e.preventDefault();
      S.speedMul = Number(btn.dataset.speed);
      document.querySelectorAll(".spd").forEach((b) => b.classList.toggle("on", b === btn));
    };
  });

  resetWorld(false);
  renderOverlay();
  renderHud();
  requestAnimationFrame(loop);
})();
