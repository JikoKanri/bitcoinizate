(() => {
  const canvas = document.getElementById("c");
  const field = document.getElementById("field");
  const overlay = document.getElementById("overlay");
  const A = window.ArcadeAudio;
  const POWER_S = 5;
  const HALVE_N = 21;
  const HALVE_GAP = 210;
  const GREEN = "#4f9d6e";
  const RED = "#c45c4a";
  const BTC = "#c8960a";
  const KEY = "bitcoinizate-v1";

  const $ = (id) => document.getElementById(id);
  const fmtUsd = (n) => {
    const x = Number(n) || 0;
    const a = Math.abs(x);
    if (a >= 1e6) return (x < 0 ? "-" : "") + "$" + (a / 1e6).toFixed(2) + "M";
    if (a >= 10000) return (x < 0 ? "-" : "") + "$" + (a / 1000).toFixed(1) + "k";
    return (x < 0 ? "-$" : "$") + Math.round(a).toLocaleString("en-US");
  };
  const money = fmtUsd;
  const fmtBtcAmt = (n) => {
    const x = Number(n) || 0;
    const a = Math.abs(x);
    if (a >= 1e6) return (x < 0 ? "-" : "") + (a / 1e6).toFixed(2) + "M";
    if (a >= 1000) return (x < 0 ? "-" : "") + (a / 1000).toFixed(2) + "k";
    if (a >= 100) return (x < 0 ? "-" : "") + a.toFixed(2);
    if (a >= 1) return (x < 0 ? "-" : "") + a.toFixed(4);
    return (x < 0 ? "-" : "") + a.toFixed(6);
  };
  const fmtBtc = (n) => fmtBtcAmt(n) + " BTC";
  const fmtVtAmt = (n) => fmtBtcAmt(n);
  const fmtVt = (n) => fmtVtAmt(n) + " VT";
  const fmtTime = (t) => {
    const s = Math.max(0, Math.floor(t));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  function pairUsd(usd) {
    const px = S.price > 0 ? S.price : 0;
    const btc = px > 0 ? Number(usd) / px : 0;
    return fmtUsd(usd) + " (" + fmtBtc(btc) + ")";
  }
  function badgeIco(kind) {
    const wrap = (inner, fill, ring) =>
      "<span class=\"help-ico\"><svg width=\"28\" height=\"28\" viewBox=\"-14 -14 28 28\">"
      + "<circle r=\"13\" fill=\"" + fill + "\" stroke=\"" + ring + "\" stroke-width=\"1.8\"/>"
      + inner + "</svg></span>";
    if (kind === "hero") return wrap("<text x=\"0\" y=\"1.2\" text-anchor=\"middle\" dominant-baseline=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#120c02\" font-family=\"Georgia,serif\">₿</text>", "#F2A900", "#ffe7a0");
    if (kind === "cash") return wrap("<g>"
      + "<rect x=\"-8\" y=\"-5\" width=\"5.2\" height=\"10\" fill=\"#1f8a4c\"/>"
      + "<rect x=\"-8\" y=\"-7\" width=\"5.2\" height=\"2\" fill=\"#9dffc4\"/>"
      + "<rect x=\"-1.2\" y=\"-3\" width=\"4.2\" height=\"8\" fill=\"#a33a32\"/>"
      + "<rect x=\"-1.2\" y=\"-6\" width=\"4.2\" height=\"3\" fill=\"#ff9b92\"/>"
      + "<rect x=\"4.4\" y=\"-4\" width=\"4.6\" height=\"9\" fill=\"#1f8a4c\"/>"
      + "<rect x=\"4.4\" y=\"-6.5\" width=\"4.6\" height=\"2.5\" fill=\"#9dffc4\"/>"
      + "</g>", "#141416", "#3a3a40");
    if (kind === "bull") return wrap("<polygon points=\"0,-7 6.5,5.5 -6.5,5.5\" fill=\"#04150c\"/>", "#1f8a4c", "#9dffc4");
    if (kind === "bear") return wrap("<polygon points=\"0,7 6.5,-5.5 -6.5,-5.5\" fill=\"#1a0605\"/>", "#a33a32", "#ff9b92");
    if (kind === "halve") return wrap("<text x=\"0\" y=\"1\" text-anchor=\"middle\" dominant-baseline=\"middle\" font-size=\"13\" font-weight=\"700\" fill=\"#1a1204\" font-family=\"IBM Plex Mono,monospace\">½</text>", "#c8960a", "#ffe7a0");
    if (kind === "cold") return wrap("<g stroke=\"#041318\" stroke-width=\"1.5\" fill=\"none\"><path d=\"M0-7V7M-6.1-3.5 6.1 3.5M-6.1 3.5 6.1-3.5\"/><path d=\"M-2.2-5.4 0-3.6 2.2-5.4M-2.2 5.4 0 3.6 2.2 5.4\"/></g>", "#1788a6", "#9befff");
    if (kind === "laser") return wrap("<g stroke-linecap=\"butt\"><path d=\"M-11-2.4H11M-11 2.4H11\" stroke=\"#fff4e8\" stroke-width=\"3.2\"/><path d=\"M-11-2.4H11M-11 2.4H11\" stroke=\"#ff2a22\" stroke-width=\"1.8\"/></g>", "#120806", "#ffe7c2");
    if (kind === "swan") return wrap("<g fill=\"#f3efe6\"><ellipse cx=\"1\" cy=\"3\" rx=\"5.2\" ry=\"3.4\" transform=\"rotate(-16)\"/><path d=\"M-1 1 Q-6-4 -1-7 Q2-7 3-5\" fill=\"none\" stroke=\"#f3efe6\" stroke-width=\"1.8\"/><polygon points=\"2.4,-5.8 6.2,-5 2.4,-4.2\" fill=\"#c45c4a\"/></g>", "#161218", "#f0e6f0");
    if (kind === "dca") return wrap("<g><path d=\"M-6 8 Q-7 3 -3 2 L-1 5 Q-4 7 -6 8Z\" fill=\"#c9a070\" stroke=\"#6a4a28\" stroke-width=\"0.8\"/><path d=\"M-3 2 L4 1 L5 4 L-1 5Z\" fill=\"#e8c49a\"/><polygon points=\"1,-6 6,-1 1,4 -4,-1\" fill=\"#c8960a\" stroke=\"#ffe7a0\" stroke-width=\"1\"/></g>", "#141416", "#3a3a40");
    return wrap("", "#141416", "#3a3a40");
  }
  function tutorialBody() {
    return "<div class=\"help\">"
      + "<p>" + badgeIco("hero") + " You are the ₿. Tap or press space to flap through the candle gaps. A wick or the floor liquidates you.</p>"
      + "<p>" + badgeIco("cash") + " Candles pay cash. Buy BTC on the dip, sell on the rip. Score is cash plus BTC at the live price, in USD.</p>"
      + "<p>" + badgeIco("bull") + " Bull pumps price. " + badgeIco("bear") + " Bear dumps it.</p>"
      + "<p>" + badgeIco("swan") + " Black swan is a hard crash. " + badgeIco("halve") + " Halving is a fat bull — grab it up or down when told.</p>"
      + "<p>" + badgeIco("cold") + " Cold storage saves a hit. Ten colds become one multisig life.</p>"
      + "<p>" + badgeIco("laser") + " Laser eyes eat a bear and unlock a perk.</p>"
      + "</div>";
  }
  const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const PERK_NAME = { dca: "DCA", ff: "FastForward", adopt: "Adoption", manip: "Manipulation", candy: "Candle candy", juke: "Jukebox" };
  function perkTitle(id, t) {
    const n = PERK_NAME[id] || id;
    return t <= 1 || id === "dca" ? n : n + " " + ROMAN[Math.min(10, t)];
  }
  function perkBlurb(id, t) {
    t = Math.max(1, Math.min(10, t));
    if (id === "candy") return (2 ** t) + "x candle income";
    if (id === "dca") return "income in btc";
    if (id === "ff") {
      const speeds = [0, 1.5, 2, 3, 0.5];
      return (speeds[t] || 1.5) + "x speed";
    }
    if (id === "adopt") return "bulls +" + (10 + t * 2) + "/" + (15 + t * 2) + "%, bears +" + Math.max(0, t - 1) + "/" + (4 + t) + "%";
    if (id === "manip") return "trend ×" + t;
    if (id === "juke") return t <= 1 ? "jukebox · 2 random tunes" : "+4 random tunes";
    return "";
  }

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
    let type = bag[(Math.random() * bag.length) | 0];
    if (type === "SWAN" && S.spawnedPipes < 7) {
      const safe = bag.filter((t) => t !== "SWAN");
      type = safe[(Math.random() * safe.length) | 0];
    }
    return type;
  }

  const S = {
    phase: "ready",
    countN: 3,
    speedMul: 1,
    W: 400, H: 640,
    bird: { x: 72, y: 280, v: 0, r: 14 },
    pipes: [], items: [], particles: [], floats: [],
    cash: 0, btc: 0, vt: 0, cold: 0, msig: 100, invuln: 0,
    power: "NONE", powerT: 0, laserOn: false, laserT: 0,
    widthMul: 1, widthT: 1, heightMul: 1, heightT: 1,
    price: 20000, vtPrice: 0,
    bg: 0, ticker: "", tickerT: 0,
    lastGapY: 0, spawnX: 0, best: loadBest(),
    dead: false, cycleStart: 20000, cycleDur: POWER_S, cycleElapsed: 0,
    vtCycle: 200, hitCap: false, lifeT: 0, sampleAcc: 0,
    tape: [], tapeVt: [], level: 1,
    startCash: 0, startPrice: 0, peakNet: 0, candles: 0, buys: 0, sells: 0, swans: 0, lasers: 0,
    halvings: 0, halveLeft: HALVE_GAP, halveBull: false, halveFloor: 0, spawnedPipes: 0, halveSide: "up",
    swanBear: false, halveSpeechUntil: 0,
    stats: null, welcomed: false, introCounted: false, speechUntil: 0,
    perkPick: "", dcaOn: false, trend: "equal", perkOffers: [],
    have: { dca: 0, ff: 0, adopt: 0, manip: 0, candy: 0, juke: 0 },
    poolTier: { dca: 1, ff: 1, adopt: 1, manip: 1, candy: 1, juke: 1 },
    offerSeq: [7, 13, 24], nextOffer: 7, offersDone: 0,
    optPanel: null, optBack: "ready",
    sellsBear: 0, coldLost: 0, boughtBtc: false, halveMiss: 0,
    jukeList: [], jukeUnlock: [], jukeTrack: 0, jukeOn: false, jukeShuffle: false, jukeRepeat: "off", jukeOff: {},
  };

  function net() { return S.cash + S.btc * S.price + S.vt * S.vtPrice; }

  function ffMax() {
    const speeds = [0, 1.5, 2, 3, 0.5];
    return S.have.ff > 0 ? (speeds[S.have.ff] || 1.5) : 1;
  }

  function metrics() {
    const birdR = Math.min(17, Math.max(13, S.H * 0.021));
    const sm = S.speedMul || 1;
    const extra = Math.max(0, sm - 1);
    const gapBoost = 1 + extra * 0.12;
    const spaceBoost = 1 + extra * 0.08;
    const yMul = 1 + extra * 0.24;
    const gapH = Math.min(S.H * 0.3, Math.max(132, birdR * 5.4)) * gapBoost;
    const pipeW = Math.min(56, Math.max(42, S.W * 0.12));
    const spacing = Math.min(260, Math.max(188, S.W * 0.46)) * spaceBoost;
    const speed = Math.min(230, Math.max(170, S.W * 0.48));
    return { birdR, gapH, pipeW, spacing, speed, gravity: S.H * 1.62 * yMul, jump: -S.H * 0.54 * yMul, margin: Math.max(52, S.H * 0.085) };
  }

  function scrollMul() {
    return S.have.ff > 0 ? (S.speedMul || 1) : 1;
  }

  function burst(x, y, color, n) {
    n = n || 10;
    for (let i = 0; i < n; i++) S.particles.push({ x, y, vx: (Math.random() - 0.5) * 180, vy: (Math.random() - 0.5) * 180 - 20, life: 0.35 + Math.random() * 0.3, color });
  }

  function grantUsd(n, x, y, kind) {
    if (kind === "gain" && S.have.candy > 0) n *= 2 ** S.have.candy;
    if (S.dcaOn && S.have.dca > 0 && S.price > 0) {
      const got = n / S.price;
      S.btc += got;
      pop(x, y, "+" + fmtAmt(got, "btc"), BTC, kind);
    } else {
      S.cash += n;
      pop(x, y, "+" + n + " usd", GREEN, kind);
    }
  }

  function pop(x, y, text, color, kind) {
    const gain = kind === "gain";
    const power = kind === "power";
    S.floats.push({
      x, y, text, color,
      life: gain || power ? 0.825 : 1.1,
      vy: gain || power ? -32 : -38,
      size: power ? 7.7 : gain ? 7 : 13,
      maxA: gain || power ? 0.75 : 0.875,
    });
  }

  function fmtAmt(n, ticker) {
    const tag = ticker.toLowerCase();
    if (tag === "usd") return Math.round(n).toLocaleString("en-US") + " usd";
    if (tag === "btc") return (n >= 1 ? n.toFixed(4) : n.toFixed(6)) + " btc";
    return (n >= 1 ? n.toFixed(3) : n.toFixed(4)) + " " + tag;
  }

  function lineDur(line) {
    if (!line) return 0;
    return Math.max(0.75, line.length * 0.078);
  }

  function spoken(line) {
    if (line === "There is no second best") return "Therese no second best";
    if (line === "You got F. T. X.'d!") return "you got F T Xed";
    return line;
  }

  function say(line, urgent, kind) {
    if (!line) return;
    const halve = kind === "halve";
    if (!halve && S.lifeT < S.halveSpeechUntil) return;
    S.ticker = line; S.tickerT = Math.max(1.5, lineDur(line));
    S.speechUntil = S.lifeT + lineDur(spoken(line));
    if (halve) S.halveSpeechUntil = S.speechUntil + 0.2;
    A.speak(spoken(line), urgent || halve);
  }

  function pickLine(pool) {
    const short = pool.filter((l) => l.length <= 18);
    const busy = S.lifeT < S.speechUntil - 0.12;
    const m = metrics();
    let speed = m.speed * scrollMul();
    if (S.power === "BULL" || S.power === "BEAR" || S.laserOn) speed *= 1.28;
    let soon = false;
    for (const it of S.items) {
      const eta = (it.x - S.bird.x) / Math.max(40, speed);
      if (eta > 0.08 && eta < 2.3) { soon = true; break; }
    }
    const bag = (!busy && !soon ? pool : short).concat([""]);
    return bag[(Math.random() * bag.length) | 0];
  }

  function applyLaser(on) {
    S.laserOn = on;
    if (on) {
      S.laserT = POWER_S; S.widthT = 0.378; S.heightT = 0.9;
    } else { S.laserT = 0; S.widthT = 1; S.heightT = 1; }
  }

  function pipeEnds(p) {
    let top0 = p.gapY - p.gapH / 2;
    let bot0 = p.gapY + p.gapH / 2;
    if (S.power === "BEAR") {
      const cut = S.swanBear ? 0.045 : 0.025;
      top0 += p.gapH * cut;
      bot0 -= p.gapH * cut;
    }
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
    S.spawnedPipes += 1;
    S.pipes.push({ x, gapY, gapH, green: Math.random() > 0.45, scored: false, seen: false });
    if (Math.random() < 0.48) {
      const type = pickItem();
      S.items.push({
        x: x + m.pipeW * S.widthMul * 0.5,
        y: gapY + (Math.random() * 2 - 1) * gapH * (type === "SWAN" ? 0.18 : 0.12),
        type, r: type === "SWAN" ? 17 : 14,
      });
    }
  }

  function tickHalve() {
    if (S.phase !== "play") return;
    if (S.halveLeft > 0) S.halveLeft -= 1;
    if (S.halveLeft === 4) {
      const pool = A.HALVE_SOON || ["Halving in sight!"];
      say(pool[(Math.random() * pool.length) | 0], true, "halve");
    }
    if (S.halveLeft === 2) {
      S.halveSide = Math.random() < 0.5 ? "up" : "down";
      say(S.halveSide === "up" ? "look up!" : "look down!", true, "halve");
    }
    if (S.halveLeft === 0) {
      spawnHalve();
      S.halveLeft = HALVE_GAP;
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
      S.peakNet = S.cash; S.candles = 0; S.buys = 0; S.sells = 0; S.swans = 0; S.lasers = 0;
      S.halvings = 0; S.lasers = 0; S.perkPick = ""; S.dcaOn = false; S.trend = "equal"; S.perkOffers = []; S.speedMul = 1;
      S.have = { dca: 0, ff: 0, adopt: 0, manip: 0, candy: 0, juke: 0 };
      S.poolTier = { dca: 1, ff: 1, adopt: 1, manip: 1, candy: 1, juke: 1 };
      S.offerSeq = [7, 13, 24]; S.nextOffer = 7; S.offersDone = 0;
      S.jukeList = []; S.jukeUnlock = []; S.jukeTrack = 0; S.jukeOn = false; S.jukeShuffle = false; S.jukeRepeat = "off"; S.jukeOff = {};
      if (A.jukeStop) A.jukeStop();
    }
    S.halveLeft = HALVE_GAP; S.halveBull = false; S.halveFloor = 0; S.spawnedPipes = 0; S.halveSide = "up";
    S.swanBear = false; S.halveSpeechUntil = 0;
    S.cold = 0; S.invuln = 0;
    if (!keepWallet) S.msig = 0;
    S.power = "NONE"; S.powerT = 0;
    applyLaser(false);
    S.widthMul = S.heightMul = 1;
    S.bg = 0; S.ticker = ""; S.tickerT = 0;
    S.lastGapY = S.bird.y; S.dead = false;
    S.cycleStart = S.price; S.cycleDur = POWER_S; S.cycleElapsed = 0;
    S.lifeT = 0; S.sampleAcc = 0; S.tape = []; S.tapeVt = [];
    S.speechUntil = 0;
    const first = S.bird.x + 210;
    spawnPipe(first); spawnPipe(first + m.spacing); spawnPipe(first + m.spacing * 2);
    S.spawnX = first + m.spacing * 2;
  }

  function beginCycle(type) {
    if (S.power !== "NONE" && S.power !== type) endCycle();
    if (type !== "BULL") S.halveBull = false;
    if (type !== "BEAR") S.swanBear = false;
    if (S.power === type) { S.powerT += POWER_S; S.cycleDur += POWER_S; return; }
    S.cycleStart = S.price; S.vtCycle = S.vtPrice;
    S.cycleDur = POWER_S; S.cycleElapsed = 0;
    S.power = type; S.powerT = POWER_S;
  }

  function halveMinRise() {
    return 15000 * Math.max(1, S.halvings);
  }

  function endCycle() {
    if (S.power === "NONE") return;
    let next;
    if (S.halveBull && S.power === "BULL") {
      const floor = S.cycleStart + halveMinRise();
      const residual = 0.1 + Math.random() * 0.08;
      next = Math.max(floor, S.cycleStart * (1 + residual));
    } else if (S.power === "BULL") {
      const t = S.have.adopt || 0;
      const lo = t ? 0.10 + t * 0.02 : 0.05;
      const span = t ? 0.05 : 0.05;
      next = S.cycleStart * (1 + lo + Math.random() * span);
    } else {
      const t = S.have.adopt || 0;
      const lo = t ? (t - 1) * 0.01 : -0.05;
      const span = t ? 0.04 + t * 0.01 : 0.10;
      next = S.cycleStart * (1 + lo + Math.random() * span);
    }
    if (S.halveFloor > 0) next = Math.max(next, S.halveFloor);
    S.price = Math.max(0.01, next);
    if (S.level >= 2 && S.vtCycle > 0) S.vtPrice = Math.max(1, S.vtCycle * (S.halveBull ? 1.06 : 1 + (S.price / S.cycleStart - 1) * 0.55));
    S.power = "NONE"; S.powerT = 0; S.halveBull = false; S.swanBear = false;
  }

  function spawnHalve() {
    if (S.items.some((it) => it.type === "HALVE")) return;
    const m = metrics();
    const pw = m.pipeW * S.widthMul;
    let x = S.W + 56;
    for (const p of S.pipes) {
      if (x > p.x - 24 && x < p.x + pw + 24) x = p.x + pw + 30;
    }
    if (x < S.W + 36) x = S.W + 56;
    const up = S.halveSide !== "down";
    const r = 17;
    let y;
    if (up) y = Math.max(22, m.margin * 0.42);
    else {
      const box = $("trades") && $("trades").getBoundingClientRect();
      const fieldR = field.getBoundingClientRect();
      const btnTop = box && fieldR.height ? box.top - fieldR.top : S.H - 52;
      y = Math.max(r + 8, btnTop - r - 10);
    }
    S.items.push({
      x,
      y,
      type: "HALVE",
      r,
    });
    A.sfx.cap();
  }

  function missHalve() {
    S.halveMiss = (S.halveMiss || 0) + 1;
    const pool = A.HALVE_MISS || ["Halving aborted", "The grinch stole the halving", "Bitcoin C.E.O to cancel halving", "Gary Gensler stole the halving", "Peter Schiff stole the halving", "Faketoshi stole the halving"];
    const line = pool[(Math.random() * pool.length) | 0];
    if (line) say(line, true, "halve");
    S.halveSide = "up";
  }

  function collect(it) {
    const color = it.type === "BULL" || it.type === "HALVE" ? GREEN : it.type === "BEAR" ? RED : it.type === "COLD" ? "#33c6e8" : it.type === "LASER" ? "#e8902a" : "#c9a0ff";
    burst(it.x, it.y, color, 12);
    grantUsd(500, it.x, it.y - 18, "power");
    if (it.type === "SWAN") {
      const pool = S.cold >= 1
        ? A.SWAN
        : A.SWAN.filter((l) => l !== "Cold storage lost!");
      const line = pool[(Math.random() * pool.length) | 0];
      S.ticker = line; S.tickerT = 2.4;
      if (S.lifeT >= S.halveSpeechUntil) A.speak(spoken(line), true);
      A.sfx.boom();
      applyLaser(false);
      if (S.cold > 0) { S.coldLost = (S.coldLost || 0) + S.cold; S.cold = 0; }
      S.swanBear = true;
      beginCycle("BEAR");
      return;
    }
    if (it.type === "LASER") {
      S.lasers += 1;
      if (S.laserOn) S.laserT += POWER_S; else applyLaser(true);
      const line = pickLine(A.LASER && A.LASER.length ? A.LASER : ["Laser eyes!"]);
      say(line || "Laser eyes!", true);
      A.sfx.power();
      if (S.lasers === S.nextOffer) { rollPerks(); S.perkPick = ""; setPhase("perk"); }
      return;
    }
    if (it.type === "COLD") {
      S.cold += 1;
      if (S.cold >= 10) {
        S.cold -= 10;
        S.msig += 1;
        const line = Math.random() < 0.5 ? "Multisig enabled" : "Security improved to multisig";
        say(line, true);
      } else say("Cold storage secured!");
      A.sfx.coin();
      return;
    }
    if (it.type === "BEAR" && S.laserOn) {
      A.sfx.wave();
      return;
    }
    if (it.type === "HALVE") {
      S.halvings += 1;
      beginCycle("BULL");
      S.halveBull = true;
      S.halveFloor = Math.max(S.halveFloor, S.cycleStart + halveMinRise());
      S.cycleDur = POWER_S * 1.2;
      S.powerT = S.cycleDur;
      say("halving number " + S.halvings, true, "halve");
      A.sfx.cap();
      return;
    }
    beginCycle(it.type);
    const line = pickLine(it.type === "BULL" ? A.BULL : A.BEAR);
    if (line) say(line, true);
    if (it.type === "BULL") A.sfx.wave();
    else A.sfx.hit();
  }

  function hitFatal() {
    if (S.invuln > 0) return;
    if (S.cold > 0) { rescue(); return; }
    if (S.msig > 0) {
      S.msig -= 1;
      S.cold = 9;
      S.invuln = 1.4;
      S.bird.v = metrics().jump * 0.7;
      S.bird.y = Math.min(Math.max(S.bird.y, 70), S.H - 70);
      say("Multisig rescue!", true);
      A.sfx.coin();
      burst(S.bird.x, S.bird.y, "#c8960a", 14);
      return;
    }
    die();
  }

  function rescue() {
    S.cold -= 1; S.coldLost = (S.coldLost || 0) + 1; S.invuln = 1.4;
    S.bird.v = metrics().jump * 0.7;
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
    S.bird.v = metrics().jump; A.sfx.jump();
  }
  function buyBtc() {
    if (S.phase !== "play" || S.cash <= 0 || S.price <= 0) return;
    const usd = S.cash, got = usd / S.price;
    S.btc += got; S.cash = 0; S.buys++; S.boughtBtc = true; A.sfx.buy();
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(got, "btc"), BTC, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(usd, "usd"), RED, "trade");
  }
  function sellBtc() {
    if (S.phase !== "play" || S.btc <= 0) return;
    const btc = S.btc, usd = btc * S.price;
    S.cash += usd; S.btc = 0; S.sells++;
    if (S.power === "BEAR" || S.swanBear) S.sellsBear = (S.sellsBear || 0) + 1; A.sfx.sell();
    const sellLine = pickLine(A.SELL);
    if (sellLine) say(sellLine, true);
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(usd, "usd"), GREEN, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(btc, "btc"), RED, "trade");
  }
  function buyVt() {
    if (S.phase !== "play" || S.level < 2 || S.cash <= 0 || S.vtPrice <= 0) return;
    const usd = S.cash, got = usd / S.vtPrice;
    S.vt += got; S.cash = 0; S.buys++; A.sfx.buy();
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(got, "vt"), GREEN, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(usd, "usd"), RED, "trade");
  }
  function sellVt() {
    if (S.phase !== "play" || S.level < 2 || S.vt <= 0) return;
    const vt = S.vt, usd = vt * S.vtPrice;
    S.cash += usd; S.vt = 0; S.sells++; A.sfx.sell();
    const sellLine = pickLine(A.SELL);
    if (sellLine) say(sellLine, true);
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(usd, "usd"), GREEN, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(vt, "vt"), RED, "trade");
  }
  function togglePause() {
    if (S.phase === "perk") {
      if (!S.perkPick) return;
      grantPerk(S.perkPick);
      bumpOffer();
      setPhase("play");
      return;
    }
    if (S.phase === "play") { S.optBack = "play"; setPhase("paused"); }
    else if (S.phase === "paused") setPhase(S.optBack || "play");
  }

  function pickPerk(kind) {
    S.perkPick = kind;
    renderOverlay();
    renderHud();
  }

  function grantPerk(kind) {
    const cap = kind === "ff" ? 4 : kind === "juke" ? 5 : 10;
    const t = kind === "dca" ? 1 : Math.min(cap, S.poolTier[kind] || 1);
    S.have[kind] = t;
    if (kind !== "dca") S.poolTier[kind] = Math.min(cap, t + 1);
    if (kind === "dca") S.dcaOn = true;
    if (kind === "ff") S.speedMul = ffMax();
    if (kind === "manip" && !S.trend) S.trend = "equal";
    if (kind === "juke") fillJukebox();
  }

  function bumpOffer() {
    S.offersDone += 1;
    const s = S.offerSeq;
    if (S.offersDone < s.length) S.nextOffer = s[S.offersDone];
    else {
      const n = s[s.length - 1] + s[s.length - 2] + s[s.length - 3];
      s.push(n);
      S.nextOffer = n;
    }
  }

  function rollPerks() {
    const ids = ["dca", "ff", "adopt", "manip", "candy", "juke"].filter((id) => {
      if (id === "dca") return S.have.dca <= 0;
      if (id === "ff") return S.have.ff < 4;
      if (id === "juke") return (S.have.juke || 0) < 5;
      return (S.poolTier[id] || 1) <= 10;
    });
    const bag = ids.length >= 2 ? ids : ["dca", "ff", "adopt", "manip", "candy", "juke"];
    const copy = bag.slice();
    const a = copy.splice((Math.random() * copy.length) | 0, 1)[0];
    const b = copy.splice((Math.random() * copy.length) | 0, 1)[0];
    S.perkOffers = [a, b];
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
    const jukeLive = S.jukeOn && A.jukePlaying && A.jukePlaying();
    if (p === "play") {
      if (S.jukeOn && A.jukePaused && A.jukePaused()) A.jukeResume();
      else if (!jukeLive) A.startMusic(() => S.power, () => S.phase === "play");
    } else {
      A.stopMusic();
    }
    field.classList.toggle("bull", S.power === "BULL");
    field.classList.toggle("bear", S.power === "BEAR");
    field.classList.toggle("swan-bear", S.power === "BEAR" && S.swanBear);
    field.classList.toggle("perk-ui", p === "perk");
    renderOverlay();
    renderHud();
  }

  function startGame() {
    A.unlock(); A.sfx.start();
    if (!S.welcomed) { A.speak("Welcome to choppy bitcoin: survive the market!"); S.welcomed = true; }
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

    let speed = m.speed * scrollMul();
    if (S.power === "BULL" || S.power === "BEAR" || S.laserOn) speed *= 1.28;
    if (S.power === "BULL" || S.power === "BEAR") {
      S.powerT -= dt; S.cycleElapsed += dt;
      const u = Math.min(1, S.cycleElapsed / Math.max(0.001, S.cycleDur));
      const envelope = Math.sin(Math.PI * u);
      const dir = S.power === "BULL" ? 1 : -1;
      const amp = S.halveBull ? 0.62 : 0.275;
      const wobble = Math.sin(S.cycleElapsed * 3.2) * (S.halveBull ? 0.05 : 0.03);
      S.price = Math.max(0.01, S.cycleStart * (1 + dir * amp * envelope + wobble));
      if (S.level >= 2) S.vtPrice = Math.max(1, S.vtCycle * (1 + dir * (S.halveBull ? 0.22 : 0.125) * envelope + wobble * 0.45));
      if (S.powerT <= 0) endCycle();
    } else {
      let bias = 0.0024, mid = 0.42;
      if (S.have.manip > 0) {
        const k = S.have.manip;
        if (S.trend === "up") { bias = 0.004 * k; mid = Math.max(0.22, 0.42 - 0.02 * k); }
        else if (S.trend === "down") { bias = -0.004 * k; mid = Math.min(0.78, 0.42 + 0.02 * k); }
        else { bias = 0; mid = 0.5; }
      }
      S.price = Math.max(0.01, S.price + (Math.random() - mid) * S.price * 0.012 * dt + S.price * bias * dt);
      if (S.level >= 2) S.vtPrice = Math.max(1, S.vtPrice + (Math.random() - 0.45) * S.vtPrice * 0.01 * dt + S.vtPrice * 0.0012 * dt);
    }
    S.lifeT += dt; S.sampleAcc += dt;
    while (S.sampleAcc >= 0.12) {
      S.tape.push(S.price);
      if (S.level >= 2) S.tapeVt.push(S.vtPrice);
      S.sampleAcc -= 0.12;
    }
    if (!S.hitCap && (S.btc >= 21e6 || net() >= 21e6 * Math.max(0.01, S.price))) {
      S.hitCap = true; A.sfx.cap();
      A.speak("Twenty one million. The float is yours.", true);
      S.stats = collectRunStats();
      setPhase("win");
      return;
    }
    if (S.laserOn) { S.laserT -= dt; if (S.laserT <= 0) applyLaser(false); }
    S.bird.v += m.gravity * dt; S.bird.y += S.bird.v * dt;
    if (S.power === "BEAR") {
      const k = S.swanBear ? 1 : 0.52;
      S.bird.y += Math.sin(S.lifeT * 36) * 26 * dt * k;
      S.bird.v += Math.sin(S.lifeT * 21) * 55 * dt * k;
    }
    if (S.bird.y + S.bird.r > S.H - 4) {
      S.bird.y = S.H - 4 - S.bird.r;
      if (S.invuln <= 0) hitFatal();
    }
    if (S.bird.y - S.bird.r < 0) { S.bird.y = S.bird.r; S.bird.v = 0; }

    const pw = m.pipeW * S.widthMul;
    let guard = 0;
    while (guard++ < 8) {
      const last = S.pipes[S.pipes.length - 1];
      if (last && last.x > S.W - 8) break;
      const nx = last ? last.x + m.spacing : S.W + 40;
      spawnPipe(nx);
    }
    const hitR = S.bird.r * 0.78;
    for (let i = S.pipes.length - 1; i >= 0; i--) {
      const p = S.pipes[i];
      p.x -= speed * dt;
      if (!p.seen && p.x <= S.W && p.x > S.W - Math.max(speed * dt, 6) - 2) {
        p.seen = true;
        tickHalve();
      }
      if (!p.scored && p.x + pw < S.bird.x) {
        p.scored = true; S.candles++; A.sfx.coin();
        grantUsd(100, p.x + pw * 0.5, p.gapY, "gain");
      }
      const inX = S.bird.x + hitR > p.x + 2 && S.bird.x - hitR < p.x + pw - 2;
      if (inX) {
        const ends = pipeEnds(p);
        if (S.bird.y - hitR < ends.top + 2 || S.bird.y + hitR > ends.bot - 2) {
          if (S.power === "BULL") { burst(p.x + pw * 0.5, S.bird.y, GREEN, 8); A.sfx.wave(); grantUsd(200, p.x + pw * 0.5, S.bird.y - 16, "gain"); S.pipes.splice(i, 1); continue; }
          else if (S.invuln <= 0) hitFatal();
        }
      }
      if (p.x + pw < -60) S.pipes.splice(i, 1);
    }
    for (let j = S.items.length - 1; j >= 0; j--) {
      const it = S.items[j];
      it.x -= speed * dt;
      if (S.laserOn && (it.type === "SWAN" || it.type === "BEAR") && it.x > S.bird.x - 8 && Math.abs(it.y - S.bird.y) < it.r + 14) {
        burst(it.x, it.y, "#e8902a", 16);
        if (it.type === "SWAN") { S.swans++; A.sfx.boom(); say("Black swan vaporized!", true); }
        else A.sfx.wave();
        S.items.splice(j, 1); continue;
      }
      const dx = S.bird.x - it.x, dy = S.bird.y - it.y;
      if (dx * dx + dy * dy < (hitR + it.r) * (hitR + it.r)) { collect(it); S.items.splice(j, 1); continue; }
      if (it.x < -40) {
        if (it.type === "HALVE") missHalve();
        S.items.splice(j, 1);
      }
    }
    const n = net();
    if (n > S.peakNet) S.peakNet = n;
    field.classList.toggle("bull", S.power === "BULL");
    field.classList.toggle("bear", S.power === "BEAR");
    field.classList.toggle("swan-bear", S.power === "BEAR" && S.swanBear);
  }

  function drawPowerIcon(ctx, it, wash) {
    const r = it.r;
    const pal = {
      BULL: { fill: "#1f8a4c", ring: "#9dffc4", ink: "#04150c" },
      BEAR: { fill: "#a33a32", ring: "#ff9b92", ink: "#1a0605" },
      LASER: { fill: "#120806", ring: "#ffe7c2", ink: "#ff2d24" },
      COLD: { fill: "#1788a6", ring: "#9befff", ink: "#041318" },
      SWAN: { fill: "#161218", ring: "#f0e6f0", ink: "#f3efe6" },
      HALVE: { fill: "#c8960a", ring: "#ffe7a0", ink: "#1a1204" },
    }[it.type];
    if (!pal) return;
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
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.52);
      ctx.lineTo(r * 0.48, r * 0.38);
      ctx.lineTo(-r * 0.48, r * 0.38);
      ctx.closePath(); ctx.fill();
    } else if (it.type === "BEAR") {
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.52);
      ctx.lineTo(r * 0.48, -r * 0.38);
      ctx.lineTo(-r * 0.48, -r * 0.38);
      ctx.closePath(); ctx.fill();
    } else if (it.type === "LASER") {
      ctx.strokeStyle = wash ? "#04150c" : "#fff4e8";
      ctx.lineWidth = Math.max(3.6, r * 0.28);
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(-r * 0.92, -r * 0.18); ctx.lineTo(r * 0.92, -r * 0.18);
      ctx.moveTo(-r * 0.92, r * 0.18); ctx.lineTo(r * 0.92, r * 0.18);
      ctx.stroke();
      ctx.strokeStyle = wash || "#ff2a22";
      ctx.lineWidth = Math.max(2.1, r * 0.16);
      ctx.beginPath();
      ctx.moveTo(-r * 0.92, -r * 0.18); ctx.lineTo(r * 0.92, -r * 0.18);
      ctx.moveTo(-r * 0.92, r * 0.18); ctx.lineTo(r * 0.92, r * 0.18);
      ctx.stroke();
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
    } else if (it.type === "HALVE") {
      ctx.fillStyle = ink;
      ctx.font = "700 " + Math.round(r * 1.05) + "px \"IBM Plex Mono\", monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("½", 0, 1);
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
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const f of S.floats) {
      ctx.font = "700 " + f.size + "px \"IBM Plex Mono\", monospace";
      ctx.globalAlpha = f.maxA * Math.max(0, Math.min(1, f.life / 0.28));
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

  let fitW = 0, fitH = 0, fitCtx = null;
  function fit() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.parentElement.getBoundingClientRect();
    const W = Math.max(280, r.width), H = Math.max(320, r.height);
    if (fitCtx && W === fitW && H === fitH) return fitCtx;
    fitW = W; fitH = H;
    S.W = W; S.H = H;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    fitCtx = canvas.getContext("2d");
    fitCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return fitCtx;
  }

  function renderHud() {
    $("clock").textContent = fmtTime(S.lifeT);
    $("clock").classList.toggle("hide", S.phase === "ready" || S.phase === "count");
    $("h-cash").textContent = money(S.cash);
    $("h-btc").textContent = fmtBtcAmt(S.btc);
    $("h-price").textContent = money(S.price);
    $("h-cold").textContent = String(S.cold);
    $("h-msig").textContent = String(S.msig);
    $("h-laser").textContent = String(S.lasers);
    $("h-vt").textContent = fmtVt(S.vt);
    $("h-vtpx").textContent = money(S.vtPrice);
    $("h-halve").textContent = String(S.halveLeft);
    $("h-halves").textContent = String(S.halvings);
    const bonus = S.level >= 2;
    $("hud").className = "hud-grid " + (bonus ? "hud-3" : "hud-4");
    const on = (id, vis) => { const el = $(id); if (el) el.classList.toggle("hide", !vis); };
    on("h-vt-wrap", bonus);
    on("h-vtpx-wrap", bonus);
    on("vt-row", bonus);
    on("spd-lab", S.have.ff > 0);
    on("spd-1", S.have.ff > 0);
    on("spd-2", S.have.ff > 0);
    const spd2 = $("spd-2");
    if (spd2) {
      const mx = ffMax();
      spd2.textContent = (mx % 1 ? mx.toFixed(1) : String(mx)) + "x";
      spd2.classList.toggle("on", S.speedMul !== 1);
    }
    $("spd-1") && $("spd-1").classList.toggle("on", S.speedMul === 1);
    on("dca-btn", S.have.dca > 0);
    on("trend-lab", S.have.manip > 0);
    on("trend-up", S.have.manip > 0);
    on("trend-eq", S.have.manip > 0);
    on("trend-dn", S.have.manip > 0);
    ["trend-up", "trend-eq", "trend-dn"].forEach((id) => {
      const el = $(id);
      if (el) el.classList.toggle("on", S.trend === el.dataset.trend);
    });
    const dca = $("dca-btn");
    if (dca) {
      dca.classList.toggle("on", S.dcaOn);
      dca.textContent = S.dcaOn ? "DCA ON" : "DCA OFF";
      dca.setAttribute("aria-pressed", S.dcaOn ? "true" : "false");
    }
    const pauseBtn = $("pause-btn");
    if (pauseBtn) {
      const paused = S.phase === "paused" || S.phase === "perk";
      pauseBtn.textContent = paused ? "▶" : "||";
      pauseBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
    }
    if (S.have.ff <= 0) S.speedMul = 1;
    else if (S.speedMul !== 1) S.speedMul = ffMax();
    const playing = S.phase === "play" || S.phase === "paused" || S.phase === "perk";
    $("trades").classList.toggle("hide", !playing);
    $("pause-btn").classList.toggle("hide", !playing);
    let status = "";
    if (S.halveBull) status = "HALVING  " + Math.ceil(S.powerT) + "s";
    else if (S.power === "BULL") status = "BULL RUN  " + Math.ceil(S.powerT) + "s";
    else if (S.power === "BEAR") status = "BEAR CRASH  " + Math.ceil(S.powerT) + "s";
    if (S.laserOn) status = status ? status + "  ·  LASER " + Math.ceil(S.laserT) + "s" : "LASER  " + Math.ceil(S.laserT) + "s";
    $("status").textContent = status;
    $("status").classList.toggle("hide", !(status && S.phase === "play"));
    const cap = $("caption");
    if (cap) {
      cap.textContent = S.ticker || "";
      cap.classList.toggle("hide", !S.ticker || S.phase !== "play");
    }
  }

  function collectRunStats() {
    return {
      time: S.lifeT, startCash: S.startCash, startPrice: S.startPrice, peakNet: S.peakNet,
      candles: S.candles, buys: S.buys, sells: S.sells, sellsBear: S.sellsBear || 0,
      coldLost: S.coldLost || 0, boughtBtc: !!S.boughtBtc, swans: S.swans, lasers: S.lasers,
      halvings: S.halvings || 0, halveMiss: S.halveMiss || 0,
      endCash: S.cash, endBtc: S.btc, endPrice: S.price, net: net(),
      haveSum: Object.keys(S.have).reduce((n, k) => n + (S.have[k] || 0), 0),
      iabud: S.have.iabud || 0
    };
  }
  function runAwards(st) {
    const out = [];
    if ((st.sells || 0) === 0) out.push({ name: "Maxi Soul", why: "Never sold BTC — not by hand, not by IAbud." });
    if ((st.halveMiss || 0) === 0 && (st.halvings || 0) > 0) out.push({ name: "Halving Catcher", why: "Every halving that spawned was eaten." });
    if (!st.boughtBtc) out.push({ name: "Nocoiner", why: "Never bought BTC." });
    if ((st.halvings || 0) === 0) out.push({ name: "Greedy Miner", why: "Ate 0 halvings." });
    if ((st.coldLost || 0) === 0) out.push({ name: "Opsec Warrior", why: "Lost 0 cold storage." });
    if ((st.sellsBear || 0) >= 1) out.push({ name: "Paper Hands", why: "Sold BTC " + st.sellsBear + " time" + (st.sellsBear === 1 ? "" : "s") + " in a bear market." });
    return out;
  }
  function jukeLyricsOn() { return localStorage.getItem("choppy-juke-lyrics") === "1"; }
  function setJukeLyrics(on) { localStorage.setItem("choppy-juke-lyrics", on ? "1" : "0"); }
  function jukeEnabledList() {
    if (!S.jukeOff) S.jukeOff = {};
    return (S.jukeList || []).filter((id) => !S.jukeOff[id]);
  }
  function fillJukebox() {
    const all = (A.JUKE_CORE && A.JUKE_CORE.slice()) || Object.keys(A.SONGS || {});
    if (!S.jukeUnlock) S.jukeUnlock = [];
    const seen = {};
    S.jukeUnlock.forEach((id) => { seen[id] = true; });
    const extra = all.filter((id) => !seen[id]);
    for (let i = extra.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = extra[i]; extra[i] = extra[j]; extra[j] = tmp;
    }
    S.jukeUnlock = S.jukeUnlock.concat(extra);
    const t = Math.max(0, S.have.juke || 0);
    const n = t <= 0 ? 0 : Math.min(all.length, t <= 1 ? 2 : 2 + (t - 1) * 4);
    S.jukeList = S.jukeUnlock.slice(0, n);
    if (S.jukeTrack >= S.jukeList.length) S.jukeTrack = 0;
  }
  function jukeSelect(i) {
    fillJukebox();
    const n = S.jukeList.length;
    if (!n) return;
    S.jukeTrack = ((i % n) + n) % n;
    if (S.jukeOn || (A.jukePaused && A.jukePaused())) {
      S.jukeOn = false;
      if (A.jukeStop) A.jukeStop();
    }
    renderOverlay();
  }
  function jukePlay() {
    fillJukebox();
    const pool = jukeEnabledList();
    if (!pool.length || !A.jukePlay) return;
    if (!pool.includes(S.jukeList[S.jukeTrack])) S.jukeTrack = S.jukeList.indexOf(pool[0]);
    const id = S.jukeList[S.jukeTrack];
    A.unlock();
    A.stopMusic();
    A.jukePlay(id);
    S.jukeOn = true;
    renderOverlay();
  }
  function jukePause() {
    if (A.jukePaused && A.jukePaused()) {
      if (A.jukeResume) A.jukeResume();
    } else if (A.jukePause) A.jukePause();
    renderOverlay();
  }
  A.onJukeEnd = function () {
    if (!S.jukeOn) return;
    fillJukebox();
    const pool = jukeEnabledList();
    if (!pool.length) { S.jukeOn = false; if (A.jukeStop) A.jukeStop(); return; }
    const cur = S.jukeList[S.jukeTrack];
    let next;
    if (S.jukeRepeat === "one") next = cur;
    else if (S.jukeShuffle) next = pool[(Math.random() * pool.length) | 0];
    else {
      const i = pool.indexOf(cur);
      if (i >= 0 && i < pool.length - 1) next = pool[i + 1];
      else if (S.jukeRepeat === "all") next = pool[0];
      else { S.jukeOn = false; if (A.jukeStop) A.jukeStop(); renderOverlay(); return; }
    }
    S.jukeTrack = S.jukeList.indexOf(next);
    if (A.jukePlay) A.jukePlay(next);
    if (S.phase === "paused") renderOverlay();
  };

  function pauseMarkup() {
    const panel = S.optPanel || "";
    if (panel === "help") {
      return "<h1>How to play</h1>" + tutorialBody() + "<button class=\"cta\" id=\"help-back\">Back</button>";
    }
    if (panel === "juke") {
      if ((S.have.juke || 0) <= 0) {
        return "<h1>Jukebox</h1><p>Unlock the Jukebox perk first.</p><button class=\"cta\" id=\"help-back\">Back</button>";
      }
      fillJukebox();
      const id = S.jukeList[S.jukeTrack] || "";
      const live = !!(A.jukePlaying && A.jukePlaying());
      const paused = !!(A.jukePaused && A.jukePaused());
      const song = A.SONGS && A.SONGS[id];
      const rows = S.jukeList.map((sid, i) => {
        const t = (A.SONGS && A.SONGS[sid] && A.SONGS[sid].title) || sid;
        const off = S.jukeOff && S.jukeOff[sid];
        return "<button type=\"button\" class=\"juke-track" + (i === S.jukeTrack ? " on" : "") + (off ? " dim" : "") + "\" data-juke=\"" + i + "\">" + (i + 1) + ". " + t + (off ? " · off" : "") + "</button>"
          + "<button type=\"button\" class=\"juke-btn\" data-skip=\"" + sid + "\">" + (off ? "On" : "Off") + "</button>";
      }).join("");
      const rpt = S.jukeRepeat || "off";
      return "<h1>Jukebox</h1><div class=\"juke retro\">"
        + "<p class=\"juke-lab\">Retro Jukebox</p>"
        + "<p class=\"juke-now\">" + (song ? song.title : id) + "</p>"
        + "<p class=\"juke-gen\">" + (song && song.genre ? song.genre : "") + "</p>"
        + "<div class=\"juke-row\">"
        + "<button type=\"button\" class=\"juke-btn\" id=\"juke-prev\">‹</button>"
        + "<button type=\"button\" class=\"juke-btn juke-play" + (live ? " on" : "") + "\" id=\"juke-play\">" + (live ? "▶ Playing" : "▶ Play") + "</button>"
        + "<button type=\"button\" class=\"juke-btn" + (paused ? " on" : "") + "\" id=\"juke-pause\">" + (paused ? "❚❚ Paused" : "❚❚ Pause") + "</button>"
        + "<button type=\"button\" class=\"juke-btn\" id=\"juke-next\">›</button>"
        + "</div>"
        + "<div class=\"juke-prog\"><div class=\"juke-prog-bar\" id=\"juke-bar\"></div></div>"
        + "<div class=\"juke-row\">"
        + "<button type=\"button\" class=\"juke-btn" + (S.jukeShuffle ? " on" : "") + "\" id=\"juke-shuf\">Shuffle</button>"
        + "<button type=\"button\" class=\"juke-btn" + (rpt !== "off" ? " on" : "") + "\" id=\"juke-rep\">Repeat " + rpt + "</button>"
        + "<button type=\"button\" class=\"juke-btn" + (jukeLyricsOn() ? " on" : "") + "\" id=\"juke-lyr\">Lyrics</button>"
        + "</div>"
        + "<div class=\"juke-list\">" + rows + "</div>"
        + "</div><button class=\"cta\" id=\"help-back\">Back</button>";
    }
    if (panel === "sound") {
      return "<h1>Sound</h1><div class=\"mute-row\">"
        + "<button type=\"button\" class=\"mute-tog\" id=\"mute-theme\">Bull/bear songs</button>"
        + "<button type=\"button\" class=\"mute-tog\" id=\"mute-sfx\">Game FX</button>"
        + "<button type=\"button\" class=\"mute-tog\" id=\"mute-voice\">Voices</button>"
        + "</div><button class=\"cta\" id=\"help-back\">Back</button>";
    }
    const fromPlay = S.optBack === "play" || S.phase === "paused";
    return "<h1>" + (fromPlay ? "Paused" : "Options") + "</h1>"
      + "<div class=\"opt-menu\">"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-sound\">Sound</button>"
      + "<button type=\"button\" class=\"cta opt-item" + ((S.have.juke || 0) > 0 ? "" : " dim") + "\" id=\"opt-juke\">Jukebox</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-help\">Tutorial</button>"
      + "</div>"
      + "<button class=\"cta\" id=\"go\">" + (fromPlay ? "Resume" : "Back") + "</button>";
  }
  function bindPauseUi() {
    const go = $("go");
    if (go) go.onclick = () => {
      S.optPanel = null;
      setPhase(S.optBack || "play");
    };
    const helpBack = $("help-back");
    if (helpBack) helpBack.onclick = (e) => { e.stopPropagation(); S.optPanel = null; renderOverlay(); };
    const optJuke = $("opt-juke");
    if (optJuke) optJuke.onclick = (e) => { e.stopPropagation(); S.optPanel = "juke"; renderOverlay(); };
    const jp = $("juke-play");
    if (jp) jp.onclick = (e) => { e.stopPropagation(); jukePlay(); };
    const jpa = $("juke-pause");
    if (jpa) jpa.onclick = (e) => { e.stopPropagation(); jukePause(); };
    const jpr = $("juke-prev");
    if (jpr) jpr.onclick = (e) => { e.stopPropagation(); jukeSelect(S.jukeTrack - 1); };
    const jn = $("juke-next");
    if (jn) jn.onclick = (e) => { e.stopPropagation(); jukeSelect(S.jukeTrack + 1); };
    overlay.querySelectorAll("[data-juke]").forEach((btn) => {
      btn.onclick = (e) => { e.stopPropagation(); jukeSelect(+btn.getAttribute("data-juke")); };
    });
    overlay.querySelectorAll("[data-skip]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const sid = btn.getAttribute("data-skip");
        if (!S.jukeOff) S.jukeOff = {};
        if (S.jukeOff[sid]) delete S.jukeOff[sid];
        else if (jukeEnabledList().length > 1) S.jukeOff[sid] = true;
        renderOverlay();
      };
    });
    const sh = $("juke-shuf");
    if (sh) sh.onclick = (e) => { e.stopPropagation(); S.jukeShuffle = !S.jukeShuffle; renderOverlay(); };
    const rp = $("juke-rep");
    if (rp) rp.onclick = (e) => {
      e.stopPropagation();
      S.jukeRepeat = S.jukeRepeat === "off" ? "all" : S.jukeRepeat === "all" ? "one" : "off";
      renderOverlay();
    };
    const ly = $("juke-lyr");
    if (ly) ly.onclick = (e) => { e.stopPropagation(); setJukeLyrics(!jukeLyricsOn()); renderOverlay(); };
    if (optHelp) optHelp.onclick = (e) => { e.stopPropagation(); S.optPanel = "help"; renderOverlay(); };
    const optSound = $("opt-sound");
    if (optSound) optSound.onclick = (e) => { e.stopPropagation(); S.optPanel = "sound"; renderOverlay(); };
  }

  function renderOverlay() {
    const p = S.phase;
    if (p === "play") { overlay.classList.add("hide"); overlay.innerHTML = ""; return; }
    overlay.classList.remove("hide");
    if (p === "ready") {
      overlay.innerHTML = "<h1>Choppy Bitcoin</h1>" + tutorialBody()
        + "<button class=\"cta\" id=\"go\">Play</button>";
      $("go").onclick = startGame;
    } else if (p === "count") {
      overlay.innerHTML = "<p class=\"count\">" + S.countN + "</p>";
    } else if (p === "perk") {
      if (!S.perkOffers || S.perkOffers.length < 2) rollPerks();
      const chosen = S.perkPick;
      const btns = S.perkOffers.map((id) => {
        const t = S.poolTier[id] || 1;
        const sel = chosen === id;
        return "<button class=\"cta" + (sel ? " on" : "") + "\" data-perk=\"" + id + "\">" + (sel ? "✓ " : "") + perkTitle(id, t) + " · " + perkBlurb(id, t) + "</button>";
      }).join("");
      overlay.innerHTML = "<h1>Laser eyes bonus</h1><p>" + (chosen ? "Selected. Tap ▶ to keep playing." : "Pick one. Then tap ▶.") + "</p><div class=\"perk-list\">" + btns + "</div>";
      overlay.querySelectorAll("[data-perk]").forEach((btn) => {
        btn.onpointerdown = (e) => { e.preventDefault(); e.stopPropagation(); pickPerk(btn.getAttribute("data-perk")); };
      });
    } else if (p === "paused") {
      overlay.innerHTML = pauseMarkup();
      bindPauseUi();
    } else if (p === "over") {
      overlay.innerHTML = "<p class=\"k\">Rekt · net worth</p><h1>" + money(net()) + "</h1><p>" + money(S.cash) + " + " + fmtBtc(S.btc) + " x " + money(S.price) + (S.level >= 2 ? " + " + fmtVt(S.vt) + " x " + money(S.vtPrice) : "") + "</p><p class=\"k\">Best " + money(S.best) + "</p><div class=\"overlay-actions\"><button class=\"cta\" id=\"go\">Try again</button><a href=\"/\" class=\"home\" aria-label=\"Back to menu\" title=\"Menu\">⌂</a></div>";
      $("go").onclick = replay;
    } else if (p === "win" && S.stats) {
      const st = S.stats;
      const awards = runAwards(st);
      overlay.innerHTML = "<p class=\"k\">TWENTY ONE MILLION</p><h1>The float is yours</h1>"
        + "<p>You stacked the cap. Here is the tape of the run.</p><ul>"
        + "<li><span class=\"k\">Time</span><span>" + fmtTime(st.time) + "</span></li>"
        + "<li><span class=\"k\">Start cash</span><span>" + money(st.startCash) + "</span></li>"
        + "<li><span class=\"k\">Start BTC px</span><span>" + money(st.startPrice) + "</span></li>"
        + "<li><span class=\"k\">End BTC px</span><span>" + money(st.endPrice) + "</span></li>"
        + "<li><span class=\"k\">Peak net</span><span>" + money(st.peakNet) + "</span></li>"
        + "<li><span class=\"k\">Net worth</span><span>" + money(st.net) + "</span></li>"
        + "<li><span class=\"k\">BTC held</span><span>" + fmtBtc(st.endBtc) + "</span></li>"
        + "<li><span class=\"k\">Candles</span><span>" + st.candles + "</span></li>"
        + "<li><span class=\"k\">Buys / sells</span><span>" + st.buys + " / " + st.sells + "</span></li>"
        + "<li><span class=\"k\">Halvings</span><span>" + (st.halvings || 0) + " caught · " + (st.halveMiss || 0) + " missed</span></li>"
        + "<li><span class=\"k\">Swans vaporized</span><span>" + st.swans + "</span></li></ul>"
        + "<div class=\"awards\"><p class=\"k\">Awards</p>"
        + (awards.length ? awards.map((a) => "<p><span class=\"ia-act\">" + a.name + "</span> — " + a.why + "</p>").join("") : "<p>No extra medals. The cap is the medal.</p>")
        + "</div>"
        + "<div class=\"overlay-actions\"><button class=\"cta\" id=\"go\">Play again</button><a href=\"/\" class=\"home\" aria-label=\"Back to menu\" title=\"Menu\">⌂</a></div>";
      $("go").onclick = replay;
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
  const optBtn = $("opt-btn");
  if (optBtn) optBtn.onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if (S.phase === "play") { S.optBack = "play"; S.optPanel = null; setPhase("paused"); }
    else if (S.phase === "ready") { S.optBack = "ready"; S.optPanel = null; renderOverlay(); }
    else if (S.phase === "paused") { S.optPanel = null; setPhase(S.optBack || "play"); }
  };
  $("dca-btn").onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if (S.have.dca <= 0) return;
    S.dcaOn = !S.dcaOn;
    renderHud();
  };
  document.querySelectorAll(".trend").forEach((btn) => {
    btn.onpointerdown = (e) => {
      e.stopPropagation(); e.preventDefault();
      if (S.have.manip <= 0) return;
      S.trend = btn.dataset.trend;
      renderHud();
    };
  });
  document.querySelectorAll(".spd").forEach((btn) => {
    btn.onpointerdown = (e) => {
      e.stopPropagation(); e.preventDefault();
      if (btn.dataset.speed === "2") {
        if (S.have.ff <= 0) return;
        S.speedMul = ffMax();
      } else S.speedMul = 1;
      document.querySelectorAll(".spd").forEach((b) => b.classList.toggle("on", b === btn));
    };
  });

  resetWorld(false);
  fillJukebox();
  renderOverlay();
  renderHud();
  requestAnimationFrame(loop);
})();
