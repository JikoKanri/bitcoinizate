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
  try {
    if (localStorage.getItem("choppy-reset-420") !== "1") {
      localStorage.removeItem("choppy-awards");
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (raw.scores) { raw.scores.choppy = 0; raw.scores.choppy2 = 0; raw.scores.choppy3 = 0; }
      localStorage.setItem(KEY, JSON.stringify(raw));
      localStorage.setItem("choppy-reset-420", "1");
    }
  } catch (e) {}

  const $ = (id) => document.getElementById(id);
  const setTxt = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  const fmtUsd = (n) => {
    const x = Number(n) || 0;
    const a = Math.abs(x);
    const sign = x < 0 ? "-" : "";
    if (a >= 1e12) return sign + "$" + (a / 1e12).toFixed(2) + "T";
    if (a >= 1e9) return sign + "$" + (a / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return sign + "$" + (a / 1e6).toFixed(2) + "M";
    if (a >= 10000) return sign + "$" + (a / 1000).toFixed(1) + "k";
    return (x < 0 ? "-$" : "$") + Math.round(a).toLocaleString("en-US");
  };
  const money = fmtUsd;
  const fmtBtcAmt = (n) => {
    const x = Number(n) || 0;
    const a = Math.abs(x);
    const sign = x < 0 ? "-" : "";
    if (a >= 1e12) return sign + (a / 1e12).toFixed(2) + "T";
    if (a >= 1e9) return sign + (a / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return sign + (a / 1e6).toFixed(2) + "M";
    if (a >= 1000) return sign + (a / 1000).toFixed(2) + "k";
    if (a >= 100) return sign + a.toFixed(2);
    if (a >= 1) return sign + a.toFixed(4);
    return sign + a.toFixed(6);
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
    if (kind === "swan") return wrap("<g fill=\"#0a0a0c\"><ellipse cx=\"1\" cy=\"3\" rx=\"5.2\" ry=\"3.4\" transform=\"rotate(-16)\"/><path d=\"M-1 1 Q-6-4 -1-7 Q2-7 3-5\" fill=\"none\" stroke=\"#0a0a0c\" stroke-width=\"1.8\"/><polygon points=\"2.4,-5.8 6.2,-5 2.4,-4.2\" fill=\"#c45c4a\"/></g>", "#f3efe6", "#1a1a1c");
    if (kind === "dca") return wrap("<g><path d=\"M-6 8 Q-7 3 -3 2 L-1 5 Q-4 7 -6 8Z\" fill=\"#c9a070\" stroke=\"#6a4a28\" stroke-width=\"0.8\"/><path d=\"M-3 2 L4 1 L5 4 L-1 5Z\" fill=\"#e8c49a\"/><polygon points=\"1,-6 6,-1 1,4 -4,-1\" fill=\"#c8960a\" stroke=\"#ffe7a0\" stroke-width=\"1\"/></g>", "#141416", "#3a3a40");
    return wrap("", "#141416", "#3a3a40");
  }
  function t(k) { return (window.BZ && BZ.t) ? BZ.t(k) : k; }

  function tutorialBody() {
    return "<div class=\"help\">"
      + "<p>" + badgeIco("hero") + " " + t("tut1") + "</p>"
      + "<p>" + badgeIco("cash") + " " + t("tut2") + "</p>"
      + "<p>" + badgeIco("bull") + " " + t("tut3a") + " " + badgeIco("bear") + " " + t("tut3b") + "</p>"
      + "<p>" + badgeIco("swan") + " " + t("tut4a") + " " + badgeIco("halve") + " " + t("tut4b") + "</p>"
      + "<p>" + badgeIco("cold") + " " + t("tut5") + "</p>"
      + "<p>" + badgeIco("laser") + " " + t("tut6") + "</p>"
      + "</div>";
  }
  const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const PERK_NAME = { dca: "DCA", ff: "FastForward", adopt: "Adoption", manip: "Manipulation", candy: "Candle candy", juke: "Jukebox", aibud: "A.I. bud", job: "Employment", market: "Marketplace", chance: "Chance" };
  const PERK_NAME_ES = { dca: "DCA", ff: "FastForward", adopt: "Adopción", manip: "Manipulación", candy: "Caramelo de vela", juke: "Jukebox", aibud: "A.I. bud", job: "Empleo", market: "Mercado", chance: "Chance" };
  const PERK_MAX = { dca: 1, ff: 3, adopt: 10, manip: 12, candy: 10, juke: 5, aibud: 6, job: 7, market: 1, chance: 7 };
  const JOBS = [
    { name: "Acting career", nameEs: "Carrera de actuación", curve: "hit",
      pay: [240, 260, 310, 420, 780, 2100, 5600],
      titles: ["Background extra", "Community-theater lead", "Soap regular", "Festival film lead", "Prestige-TV regular", "Blockbuster support", "A-list lead"],
      titlesEs: ["Extra de fondo", "Protagonista de teatro barrial", "Fijo en una telenovela", "Protagonista de festival", "Fijo en serie de prestigio", "Soporte de blockbuster", "Estrella A-list"] },
    { name: "Diving career", nameEs: "Carrera de buceo", curve: "steady",
      pay: [360, 480, 620, 780, 980, 1220, 1520],
      titles: ["Pool attendant", "Open-water intern", "Harbor salvage hand", "Commercial welder-diver", "Saturation diver", "Deep-wreck chief", "Expedition dive master"],
      titlesEs: ["Playero de pileta", "Pasante de aguas abiertas", "Salvamento de puerto", "Soldador submarino", "Buzo de saturación", "Jefe de pecios profundos", "Maestro de expedición"] },
    { name: "Science career", nameEs: "Carrera científica", curve: "steady",
      pay: [400, 520, 660, 840, 1060, 1320, 1640],
      titles: ["Lab dishwasher", "Grad-school grunt", "Postdoc", "Staff researcher", "Principal investigator", "National-lab fellow", "Prize shortlist"],
      titlesEs: ["Lava tubos", "Becario agotado", "Postdoc", "Investigador de planta", "Investigador principal", "Fellow de laboratorio nacional", "Lista al premio"] },
    { name: "Law career", nameEs: "Carrera de derecho", curve: "steady",
      pay: [440, 580, 740, 940, 1180, 1460, 1800],
      titles: ["Mailroom clerk", "Paralegal", "Public-defender grind", "Junior associate", "Trial counsel", "Name-on-the-door partner", "Chief counsel"],
      titlesEs: ["Mailroom", "Paralegal", "Defensoría pública", "Asociado junior", "Litigante", "Socio con el nombre en la puerta", "Consejero jefe"] },
    { name: "Culinary career", nameEs: "Carrera culinaria", curve: "steady",
      pay: [320, 440, 580, 740, 940, 1180, 1480],
      titles: ["Dish pit", "Line cook", "Sous-chef", "Head chef", "Michelin kitchen", "Private-yacht chef", "World's-best kitchen"],
      titlesEs: ["Fregadero", "Cocinero de línea", "Sous-chef", "Chef ejecutivo", "Cocina Michelin", "Chef de yate", "Cocina top mundial"] },
    { name: "Aviation career", nameEs: "Carrera de aviación", curve: "hit",
      pay: [240, 290, 380, 560, 980, 1900, 4200],
      titles: ["Banner-tow grunt", "Bush hopper", "Regional first officer", "Major-airline first officer", "Captain", "Long-haul captain", "Test pilot"],
      titlesEs: ["Arrastra carteles", "Piloto de monte", "Primer oficial regional", "Primer oficial de major", "Capitán", "Capitán de largo haul", "Piloto de pruebas"] },
    { name: "Music career", nameEs: "Carrera musical", curve: "hit",
      pay: [240, 270, 330, 460, 820, 1750, 4800],
      titles: ["Subway busker", "Wedding-band hire", "Studio session", "Touring sideman", "Festival headliner", "Symphony soloist", "World-tour closer"],
      titlesEs: ["Callejero del subte", "Banda de casamientos", "Sesionista", "Músico de gira", "Headliner de festival", "Solista de sinfónica", "Cierre de gira mundial"] },
    { name: "Athletic career", nameEs: "Carrera atlética", curve: "hit",
      pay: [240, 255, 300, 410, 760, 2200, 6200],
      titles: ["Rec-league bench", "Semi-pro", "Minors call-up", "Starting roster", "All-star", "Champion", "Hall of fame"],
      titlesEs: ["Banca del rec", "Semi-pro", "Ascenso a menores", "Titular", "All-star", "Campeón", "Salón de la fama"] },
    { name: "Medical career", nameEs: "Carrera médica", curve: "steady",
      pay: [480, 620, 780, 980, 1220, 1500, 2450],
      titles: ["Orderly", "Nursing assistant", "Resident", "Attending", "Surgeon", "Department chief", "IMI Bariloche hospital director"],
      titlesEs: ["Camillero", "Ayudante de enfermería", "Residente", "Médico de planta", "Cirujano", "Jefe de servicio", "Director del hospital IMI Bariloche"] },
    { name: "Maritime career", nameEs: "Carrera marítima", curve: "steady",
      pay: [340, 460, 600, 770, 970, 1220, 1520],
      titles: ["Deck swab", "Able seaman", "Bosun", "First mate", "Ship captain", "Fleet commander", "Harbor master"],
      titlesEs: ["Limpia cubierta", "Marinero", "Contramaestre", "Primer oficial", "Capitán", "Comandante de flota", "Capitán de puerto"] }
  ];
  const FF_SPEEDS = [1.5, 2, 3];
  function perkTitle(id, tier) {
    if (id === "skip") return (window.BZ && BZ.t("declinePerk")) || "Gently decline";
    if (id === "job") {
      const job = currentJob();
      const pack = (window.BZ && BZ.lang && BZ.lang() === "es") ? PERK_NAME_ES : PERK_NAME;
      const base = job ? ((window.BZ && BZ.lang && BZ.lang() === "es") ? job.nameEs : job.name) : (pack.job || "Employment");
      return tier <= 1 ? base : base + " " + ROMAN[Math.min(ROMAN.length - 1, tier)];
    }
    const pack = (window.BZ && BZ.lang && BZ.lang() === "es") ? PERK_NAME_ES : PERK_NAME;
    const n = pack[id] || id;
    return tier <= 1 || id === "dca" ? n : n + " " + ROMAN[Math.min(ROMAN.length - 1, tier)];
  }
  function perkBlurb(id, tier) {
    try {
      tier = Math.max(1, Math.min(PERK_MAX[id] || 12, tier));
      const es = window.BZ && BZ.lang && BZ.lang() === "es";
      if (id === "skip") return es ? "seguir sin perk" : "keep flying, no perk";
      if (id === "candy") return (2 ** tier) + (es ? "x ingreso de velas" : "x candle income");
      if (id === "dca") return es ? "ingreso en btc" : "income in btc";
      if (id === "ff") return (FF_SPEEDS[tier - 1] || 1.5) + (es ? "x velocidad" : "x speed");
      if (id === "adopt") return es
        ? "bulls +" + (10 + tier * 2) + "/" + (15 + tier * 2) + "%, bears end " + adoptBearLabel(tier)
        : "bulls +" + (10 + tier * 2) + "/" + (15 + tier * 2) + "%, bears end " + adoptBearLabel(tier);
      if (id === "manip") return (es ? "tendencia ×" : "trend ×") + tier;
      if (id === "juke") return tier <= 1 ? (es ? "jukebox · 2 temas" : "jukebox · 2 random tunes") : (es ? "+4 temas al azar" : "+4 random tunes");
      if (id === "job") {
        const job = currentJob();
        const title = jobTitleAt(job, tier);
        const pay = jobPayAt(job, tier);
        return title + " · $" + pay + (es ? " / 21 velas" : " / 21 candles");
      }
      if (id === "market") return es ? "abre el mercado en el HUD" : "opens the market in the HUD";
      if (id === "chance") {
        if (tier <= 1) return es ? "1 carta cada 210 velas" : "1 card every 210 candles";
        if (tier === 2) return es ? "2 cartas cada 210 velas" : "2 cards every 210 candles";
        return es ? "2 cartas + chance de 3ra" : "2 cards + odds of a 3rd";
      }
      if (id === "aibud") {
        if (tier <= 1) return es ? "Mirá arriba/abajo + pistas de perk" : "Look up/down + perk hints";
        if (tier === 2) return es ? "elige perks solo" : "auto-picks perks";
        if (tier === 3) return es ? "DCA y tendencia solos" : "auto DCA and trend";
        if (tier === 4) return es ? "trade cada 10 velas" : "trade every 10 candles";
        if (tier === 5) return es ? "trade cada 5 velas" : "trade every 5 candles";
        return es ? "trade cada 2 velas" : "trade every 2 candles";
      }
      return "";
    } catch (e) {
      return "";
    }
  }

  function loadBest() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      return (s.scores && s.scores.choppy3) || 0;
    } catch (e) { return 0; }
  }
  function saveBest(n) {
    if (!S.ranked) return S.best || 0;
    let s = { scores: { choppy: 0 } };
    try { s = Object.assign({ scores: { choppy: 0 } }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
    s.scores = s.scores || {};
    s.scores.choppy3 = Math.max(s.scores.choppy3 || 0, n);
    localStorage.setItem(KEY, JSON.stringify(s));
    if (typeof window.submitNewHighScore === "function") {
      window.submitNewHighScore(n, { lifeT: S.lifeT, candles: S.candles, human: !!S.humanInput });
    }
    return s.scores.choppy3;
  }

  function gauss(mean, lo, hi) {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return Math.max(lo, Math.min(hi, mean + z * ((hi - lo) / 5)));
  }

  function adoptSoft(tier) {
    return Math.min(1, Math.max(0, Number(tier) || 0) / 10);
  }
  function adoptBearRange(tier) {
    const soft = adoptSoft(tier);
    const lo = -0.10 * (1 - soft * 0.75);
    let hi = -0.05 * (1 - soft * 0.80);
    if (hi >= -0.008) hi = -0.008;
    if (lo >= hi) return { lo: hi - 0.012, hi };
    return { lo, hi };
  }
  function adoptSwanRange(tier) {
    const soft = adoptSoft(tier);
    return { lo: -0.50 * (1 - soft * 0.50), hi: -0.25 * (1 - soft * 0.50) };
  }
  function adoptBearLabel(tier) {
    const r = adoptBearRange(tier);
    return Math.round(r.lo * 100) + "/" + Math.round(r.hi * 100) + "%";
  }
  function pickCycleAmp(type) {
    const t = S.have.adopt || 0;
    const soft = adoptSoft(t);
    if (type === "BULL" && S.halveBull) return 1 + (Math.random() * 0.2 - 0.1);
    if (type === "BULL") return 0.22 + t * 0.018;
    if (S.swanBear) return (0.75 + (Math.random() * 0.2 - 0.1)) * (1 - soft * 0.4);
    return (0.17 + Math.random() * 0.05) * (1 - soft * 0.45);
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
    W: 480, H: 640,
    bird: { x: 72, y: 280, v: 0, r: 14 },
    pipes: [], items: [], particles: [], floats: [],
    cash: 0, btc: 0, vt: 0, cold: 0, msig: 0, invuln: 0,
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
    stats: null, welcomed: false, introCounted: false, speechUntil: 0, humanInput: false, ranked: true,
    jobTrack: null, jobOffer: null, jobName: "",
    have: { dca: 0, ff: 0, adopt: 0, manip: 0, candy: 0, juke: 0, aibud: 0, job: 0, market: 0, chance: 0 },
    poolTier: { dca: 1, ff: 1, adopt: 1, manip: 1, candy: 1, juke: 1, aibud: 1, job: 1, market: 1, chance: 1 },
    offerSeq: [1, 2, 4], nextOffer: 1, offersDone: 0,
    optPanel: null, optBack: "ready",
    sellsBear: 0, coldLost: 0, boughtBtc: false, halveMiss: 0,
    jukeList: [], jukeUnlock: [], jukeTrack: 0, jukeOn: false, jukeShuffle: false, jukeRepeat: "off", jukeOff: {},
    aibudOn: false, aibudLit: {}, iaLog: [], iaProfit: 0, aibudSpeechUntil: 0, aiAcc: 0,
  };

  function netUsd() { return S.cash + S.btc * S.price + S.vt * S.vtPrice; }
  function netBtc() {
    const px = Math.max(0.01, S.price || 0);
    return S.btc + S.cash / px + (S.vt * (S.vtPrice || 0)) / px;
  }
  function net() { return netBtc(); }
  function scoreSats() { return Math.max(0, Math.round(netBtc() * 1e4)); }

  function ffMax() {
    if ((S.have.ff || 0) <= 0) return 1;
    return FF_SPEEDS[Math.min(FF_SPEEDS.length, S.have.ff) - 1] || 1.5;
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
    const spacing = 188 * spaceBoost;
    const speed = 173;
    return { birdR, gapH, pipeW, spacing, speed, gravity: 907 * yMul, jump: -302 * yMul, margin: Math.max(52, S.H * 0.085) };
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
    if (tag === "usd") return fmtUsd(n).replace(/^\$/, "") + " usd";
    if (tag === "btc") return fmtBtcAmt(n) + " btc";
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
    const bud = kind === "aibud";
    if (!halve && !bud && S.lifeT < S.halveSpeechUntil) return;
    if (!halve && !bud && S.lifeT < (S.aibudSpeechUntil || 0)) return;
    S.ticker = (window.BZ && BZ.lang && BZ.lang() === "es" && kind === "ui") ? line : line;
    S.tickerT = Math.max(1.5, lineDur(line));
    S.speechUntil = S.lifeT + lineDur(spoken(line));
    if (halve) S.halveSpeechUntil = S.speechUntil + 0.2;
    if (bud) S.aibudSpeechUntil = S.speechUntil + 0.15;
    A.speak(spoken(line), urgent || halve || bud);
  }

  function sayEn(en, cap, urgent, kind) {
    say(en, urgent, kind);
    if (cap) S.ticker = cap;
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

  function drawLine(pool, silentP) {
    if (Math.random() < (silentP || 0)) return "";
    if (!pool || !pool.length) return "";
    return pickLine(pool);
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
      const r = type === "SWAN" ? 17 : 14;
      const lo = gapY - gapH / 2 + r + 6;
      const hi = gapY + gapH / 2 - r - 6;
      const y = lo + Math.random() * Math.max(8, hi - lo);
      S.items.push({
        x: x + m.pipeW * S.widthMul * 0.5,
        y,
        lo, hi,
        vy: (Math.random() < 0.5 ? -1 : 1) * (22 + Math.random() * 16),
        type, r,
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
      if (S.aibudOn && (S.have.aibud || 0) >= 1) {
        sayEn(
          S.halveSide === "up" ? "Look up!" : "Look down!",
          S.halveSide === "up" ? t("lookUp") : t("lookDown"),
          true,
          "halve"
        );
      }
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
      S.peakNet = netBtc(); S.candles = 0; S.buys = 0; S.sells = 0; S.swans = 0; S.lasers = 0;
      S.halvings = 0; S.lasers = 0; S.perkPick = ""; S.perkHint = ""; S.dcaOn = false; S.trend = "off"; S.perkOffers = []; S.speedMul = 1;
      S.have = { dca: 0, ff: 0, adopt: 0, manip: 0, candy: 0, juke: 0, aibud: 0, job: 0, market: 0, chance: 0 };
      S.poolTier = { dca: 1, ff: 1, adopt: 1, manip: 1, candy: 1, juke: 1, aibud: 1, job: 1, market: 1, chance: 1 };
      S.offerSeq = S.ranked ? tribSeq(16) : [10, 20, 30];
      S.nextOffer = S.ranked ? 1 : 10;
      S.offersDone = 0;
      S.jukeList = []; S.jukeUnlock = []; S.jukeTrack = 0; S.jukeOn = false; S.jukeShuffle = false; S.jukeRepeat = "off"; S.jukeOff = {};
      S.aibudOn = false; S.aibudLit = {}; S.iaLog = []; S.iaProfit = 0; S.aibudSpeechUntil = 0; S.aiAcc = 0; S.aiTimingStart = null; S.aiTimingLast = 0; S.aiTradeAt = -999;
      S.jobName = ""; S.jobTrack = null; S.jobOffer = null; S.chanceAt = []; S.chanceUntil = 0; S.chanceUsed = {}; S.chanceCard = null; S.chanceNote = "";
      if (A && A.jukeStop) A.jukeStop();
    }
    S.halveLeft = HALVE_GAP; S.halveBull = false; S.halveFloor = 0; S.spawnedPipes = 0; S.halveSide = "up";
    S.swanBear = false; S.halveSpeechUntil = 0;
    S.cold = S.ranked ? 0 : 9;
    S.invuln = 0;
    if (!keepWallet) S.msig = S.ranked ? 0 : 999;
    S.power = "NONE"; S.powerT = 0;
    applyLaser(false);
    S.widthMul = S.heightMul = 1;
    S.bg = 0; S.ticker = ""; S.tickerT = 0;
    S.lastGapY = S.bird.y; S.dead = false;
    S.cycleStart = S.price; S.cycleDur = POWER_S; S.cycleElapsed = 0;
    S.cycleAmp = 0;
    S.lifeT = 0; S.sampleAcc = 0; S.tape = []; S.tapeVt = []; S.tapeLo = null; S.tapeHi = null;
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
    S.cycleAmp = pickCycleAmp(type);
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
    } else if (S.swanBear) {
      const r = adoptSwanRange(S.have.adopt || 0);
      next = S.cycleStart * (1 + r.lo + Math.random() * (r.hi - r.lo));
    } else {
      const r = adoptBearRange(S.have.adopt || 0);
      next = S.cycleStart * (1 + r.lo + Math.random() * (r.hi - r.lo));
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
    const y = up ? (r + 16) : (S.H - 78);
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
    const pool = A.HALVE_MISS || ["Halving aborted", "The grinch stole the halving", "Bitcoin C.E.O to cancel halving", "Gary Gensler stole the halving", "Oh no, Peter Schiff stole the halving", "Faketoshi stole the halving", "No halving soup for you!", "Halving missed"];
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
      const line = Math.random() < 0.15 ? "" : pool[(Math.random() * pool.length) | 0];
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
      const line = drawLine(A.LASER && A.LASER.length ? A.LASER : ["Laser eyes!"], 0.15);
      say(line || "Laser eyes!", true);
      A.sfx.power();
      if (S.ranked && S.lasers === S.nextOffer) openPerkOffer("laser");
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
      say("Halving number " + S.halvings, true, "halve");
      A.sfx.cap();
      return;
    }
    beginCycle(it.type);
    const line = drawLine(it.type === "BULL" ? A.BULL : A.BEAR, 0.15);
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
    if (S.dead) return;
    S.dead = true;
    S.phase = "over";
    try { applyLaser(false); } catch (e) {}
    S.power = "NONE"; S.powerT = 0;
    try { if (A && A.sfx && A.sfx.die) A.sfx.die(); } catch (e) {}
    try { if (A && A.cancelSpeech) A.cancelSpeech(); } catch (e) {}
    try { if (A && A.speak) A.speak("Rekt! You got liquidated", true); } catch (e) {}
    S.ticker = t("liquidated");
    try { S.best = saveBest(scoreSats()); } catch (e) {}
    if (field) field.classList.remove("is-play");
    try { setPhase("over"); } catch (e) { try { renderOverlay(); } catch (err) {} }
  }

  function flapBlocked(e) {
    const buy = $("buy-btc");
    if (!buy || buy.classList.contains("hide")) return false;
    const box = buy.getBoundingClientRect();
    const y = e.clientY != null ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY);
    return y != null && y >= box.top - 4;
  }

  function flap() {
    if (S.phase !== "play" || S.dead) return;
    const m = metrics();
    S.bird.v = m.jump || -280;
    try { if (A && A.sfx && A.sfx.jump) A.sfx.jump(); } catch (e) {}
  }
  function buyBtc() {
    if (S.phase !== "play" || S.cash <= 0 || S.price <= 0) return;
    const usd = S.cash, got = usd / S.price;
    S.btc += got; S.cash = 0; S.buys++; S.boughtBtc = true; A.sfx.buy();
    if (!S.aiSilent) {
      const buyLine = drawLine(A.BUY, 0.3);
      if (buyLine) say(buyLine, true);
    }
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(got, "btc"), BTC, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(usd, "usd"), RED, "trade");
  }
  function sellBtc() {
    if (S.phase !== "play" || S.btc <= 0) return;
    const btc = S.btc, usd = btc * S.price;
    S.cash += usd; S.btc = 0; S.sells++;
    if (S.power === "BEAR" || S.swanBear) S.sellsBear = (S.sellsBear || 0) + 1; A.sfx.sell();
    if (!S.aiSilent) {
      const sellLine = drawLine(A.SELL, 0.3);
      if (sellLine) say(sellLine, true);
    }
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
    const sellLine = drawLine(A.SELL, 0.3);
    if (sellLine) say(sellLine, true);
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(usd, "usd"), GREEN, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(vt, "vt"), RED, "trade");
  }
  function togglePause() {
    if (S.phase === "perk") {
      if (!S.perkPick) return;
      grantPerk(S.perkPick);
      S.perkPick = "";
      S.perkOffers = [];
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
    if (!kind || kind === "skip") return;
    const cap = PERK_MAX[kind] || 10;
    if (kind === "dca") S.have.dca = 1;
    else S.have[kind] = Math.min(cap, (S.have[kind] || 0) + 1);
    S.poolTier[kind] = Math.min(cap, (S.have[kind] || 0) + 1);
    if (kind === "dca") S.dcaOn = false;
    if (kind === "manip" && !S.trend) S.trend = "off";
    if (kind === "juke") fillJukebox();
    if (kind === "job") {
      if (S.jobTrack == null) S.jobTrack = (S.jobOffer != null ? S.jobOffer : ((Math.random() * JOBS.length) | 0));
      S.jobOffer = S.jobTrack;
      assignJob();
    }
    if (kind === "chance") planChanceWindow(S.candles || 0);
  }

  function currentJob() {
    const i = S.jobTrack != null ? S.jobTrack : S.jobOffer;
    if (i == null) return null;
    return JOBS[((i % JOBS.length) + JOBS.length) % JOBS.length];
  }

  function jobTitleAt(job, tier) {
    if (!job) return "";
    const es = window.BZ && BZ.lang && BZ.lang() === "es";
    const list = es && job.titlesEs ? job.titlesEs : job.titles;
    return list[Math.max(0, Math.min(list.length - 1, (tier || 1) - 1))] || "";
  }

  function pickJobOffer() {
    if (S.jobTrack != null) { S.jobOffer = S.jobTrack; return; }
    S.jobOffer = (Math.random() * JOBS.length) | 0;
  }

  function assignJob() {
    const t = S.have.job || 0;
    if (t <= 0) { S.jobName = ""; return; }
    if (S.jobTrack == null) S.jobTrack = S.jobOffer != null ? S.jobOffer : ((Math.random() * JOBS.length) | 0);
    S.jobName = jobTitleAt(currentJob(), t);
  }

  function jobPayAt(job, tier) {
    const t = Math.max(1, Math.min(7, tier || 1));
    if (job && job.pay && job.pay[t - 1]) return job.pay[t - 1];
    return 240;
  }

  function jobPay() {
    return jobPayAt(currentJob(), S.have.job || 0);
  }

  function payJob() {
    const n = jobPay();
    if (n <= 0) return;
    grantUsd(n, S.bird.x, S.bird.y - 24, "gain");
    say((S.jobName || "Job") + " payday", false);
  }

  function chanceP3(tier) {
    return Math.min(0.72, 0.12 + Math.max(0, tier - 3) * 0.15);
  }

  function planChanceWindow(from) {
    const t = S.have.chance || 0;
    if (t <= 0) { S.chanceAt = []; S.chanceUntil = 0; return; }
    const start = from + 1;
    const end = from + 210;
    const used = {};
    const pick = () => {
      let c, n = 0;
      do { c = start + ((Math.random() * 210) | 0); n++; } while (used[c] && n < 30);
      used[c] = true;
      return c;
    };
    const slots = [pick()];
    if (t >= 2) slots.push(pick());
    if (t >= 3 && Math.random() < chanceP3(t)) slots.push(pick());
    S.chanceAt = slots;
    S.chanceUntil = end;
  }

  function wealthUsd() {
    return Math.max(0, (S.cash || 0) + (S.btc || 0) * Math.max(0.01, S.price || 0));
  }
  function takeWealthPct(p) {
    const w = wealthUsd();
    let need = w * Math.max(0, Math.min(1, p));
    const fromCash = Math.min(S.cash, need);
    S.cash -= fromCash;
    need -= fromCash;
    if (need > 0 && S.price > 0 && S.btc > 0) {
      const b = Math.min(S.btc, need / S.price);
      S.btc -= b;
      need -= b * S.price;
    }
    return w * p - Math.max(0, need);
  }
  function takeCash(n) {
    const got = Math.min(S.cash, Math.max(0, n));
    S.cash -= got;
    return got;
  }
  function grantWealthPct(p) {
    const n = wealthUsd() * Math.max(0, p);
    S.cash += n;
    return n;
  }
  function cutPct(p) {
    return takeWealthPct(p);
  }
  function chanceLang() {
    return window.BZ && BZ.lang && BZ.lang() === "es";
  }
  const CHANCE_CARDS = [
    { id: "landfill", kind: "choice",
      title: "Marek and the dump", titleEs: "Marek y el basural",
      body: "Marek texts at 1:14 a.m. He got a permit to keep digging Docksway Landfill in Wales, where an 8,000 BTC pendrive vanished in 2009. He wants a partner, not a spectator. Lena already said the couch is not a mine.",
      bodyEs: "Marek escribe a la 1:14. Consiguió permiso para seguir cavando el basural de Docksway, Gales, donde en 2009 se perdió un pendrive de 8.000 BTC. Quiere un socio, no un espectador. Lena ya dijo que el sillón no es una mina.",
      opts: [
        { k: "a", label: "Chip in 25% of net worth", labelEs: "Poner el 25% del patrimonio" },
        { k: "b", label: "Chip in 75% of net worth", labelEs: "Poner el 75% del patrimonio" },
        { k: "c", label: "Tell Marek you pass", labelEs: "Decirle a Marek que paso" }
      ] },
    { id: "taxbill", kind: "report",
      title: "Letter for Lena", titleEs: "Carta para Lena",
      body: "The envelope is addressed to both of you. Quarterly filing. Lena puts it on the fridge next to Paco's vet reminder and waits.",
      bodyEs: "El sobre viene a nombre de los dos. Presentación trimestral. Lena lo deja en la heladera, al lado del recordatorio del vet de Paco, y espera." },
    { id: "wedding", kind: "choice",
      title: "Nico gets married", titleEs: "Se casa Nico",
      body: "Cousin Nico booked a hall that seats four hundred and a DJ who still says 'put your hands up'. Lena asks what envelope you are taking. Paco is not invited and he knows.",
      bodyEs: "El primo Nico alquiló un salón para cuatrocientos y un DJ que sigue gritando 'las manos arriba'. Lena pregunta qué sobre llevás. Paco no está invitado y lo sabe.",
      opts: [
        { k: "a", label: "Send 4% of net worth", labelEs: "Mandar 4% del patrimonio" },
        { k: "b", label: "Send 0.6% and a meme", labelEs: "Mandar 0.6% y un meme" },
        { k: "c", label: "Skip the hall", labelEs: "Saltearme el salón" }
      ] },
    { id: "patagonia", kind: "choice",
      title: "Lena booked the lake", titleEs: "Lena reservó el lago",
      body: "Last two seats on a Bariloche bus. Lena already packed the red thermos. Paco can stay with Marek for a week if you go.",
      bodyEs: "Últimos dos asientos al bus de Bariloche. Lena ya guardó el termo rojo. Paco puede quedarse con Marek una semana si se van.",
      opts: [
        { k: "a", label: "Book it · 8% of net worth", labelEs: "Reservar · 8% del patrimonio" },
        { k: "b", label: "Stay home with Paco", labelEs: "Quedarme con Paco" }
      ] },
    { id: "flu", kind: "report",
      title: "Paco's week, then yours", titleEs: "La semana de Paco, después la tuya",
      body: "Paco started it. Then Lena. Then you. The pharmacy knows your name. Soup is the only strategy that still works.",
      bodyEs: "Empezó Paco. Después Lena. Después vos. En la farmacia ya saben tu nombre. La sopa es la única estrategia que sigue andando." },
    { id: "phish", kind: "choice",
      title: "Mail from 'support'", titleEs: "Mail de «soporte»",
      body: "It says your seed is leaking. The domain is three letters off. Lena reads it over your shoulder and does not blink.",
      bodyEs: "Dice que se filtra tu seed. El dominio falla por tres letras. Lena lo lee detrás tuyo y no pestañea.",
      opts: [
        { k: "a", label: "Open the form", labelEs: "Abrir el formulario" },
        { k: "b", label: "Delete it", labelEs: "Borrarlo" }
      ] },
    { id: "crash", kind: "report",
      title: "Scooter at the light", titleEs: "Scooter en el semáforo",
      body: "A delivery kid kisses the bumper while you wait for Lena's call. Nobody is hurt. The bumper files a complaint anyway.",
      bodyEs: "Un pibe de delivery besa el paragolpes mientras esperás el llamado de Lena. Nadie se lastima. El paragolpes igual denuncia." },
    { id: "casino", kind: "choice",
      title: "Rami found a table", titleEs: "Rami encontró una mesa",
      body: "Rami swears the felt is lucky tonight. Lena is at home with Paco and a movie. You can still walk out.",
      bodyEs: "Rami jura que el paño hoy tiene suerte. Lena está en casa con Paco y una peli. Todavía podés salir.",
      opts: [
        { k: "a", label: "Bet 10% of net worth", labelEs: "Apostar 10% del patrimonio" },
        { k: "b", label: "Bet 30% of net worth", labelEs: "Apostar 30% del patrimonio" },
        { k: "c", label: "Walk out", labelEs: "Salir" }
      ] },
    { id: "poker", kind: "choice",
      title: "Rami's poker cruise", titleEs: "El crucero de póker de Rami",
      body: "Rami already has the cabin. Mid-sea tournament, buy-in that scales with the table. Lena says if you go, you text when the ship has signal.",
      bodyEs: "Rami ya tiene el camarote. Torneo en alta mar, buy-in que escala con la mesa. Lena dice que si vas, avisás cuando el barco tenga señal.",
      opts: [
        { k: "a", label: "Buy-in 8% of net worth", labelEs: "Buy-in 8% del patrimonio" },
        { k: "b", label: "Buy-in 25% of net worth", labelEs: "Buy-in 25% del patrimonio" },
        { k: "c", label: "Stay on the dock", labelEs: "Quedarme en el muelle" }
      ] },
    { id: "uncle", kind: "report",
      title: "Uncle Hector wires", titleEs: "Gira el tío Héctor",
      body: "A note in the transfer: don't tell your aunt. Buy the dip or a sandwich for Lena. Paco is not a tax category.",
      bodyEs: "Una nota en la transferencia: no le digas a tu tía. Comprá el dip o un sándwich para Lena. Paco no es una categoría fiscal." },
    { id: "school", kind: "choice",
      title: "Sofi's mint museum", titleEs: "El museo de Sofi",
      body: "Sofi — Nico's kid — needs a co-signer for the class trip to the mint museum. She already drew you on the permission slip with sunglasses.",
      bodyEs: "Sofi, la hija de Nico, necesita un firmante para el viaje al museo de la casa de moneda. Ya te dibujó en el permiso, con anteojos.",
      opts: [
        { k: "a", label: "Cover 3% of net worth", labelEs: "Cubrir 3% del patrimonio" },
        { k: "b", label: "Pass", labelEs: "Paso" }
      ] },
    { id: "roof", kind: "report",
      title: "The hallway drip", titleEs: "La gotera del pasillo",
      body: "Tuesday rain finds the crack above the hallway. Lena puts a pot under it. Paco drinks from the pot like it was the plan.",
      bodyEs: "La lluvia del martes encuentra la grieta del pasillo. Lena pone una olla. Paco toma de la olla como si fuera el plan." },
    { id: "lotto", kind: "report",
      title: "Ticket on the lid", titleEs: "El ticket de la tapa",
      body: "Stuck to Marek's coffee lid after the night shift. Lena says scratch it before Paco does.",
      bodyEs: "Pegado a la tapa del café de Marek después del turno noche. Lena dice que lo raspes antes que Paco." },
    { id: "hospital", kind: "report",
      title: "Four stitches", titleEs: "Cuatro puntos",
      body: "You looked one way. The curb looked the other. Lena meets you in the waiting room with Paco in a backpack that is not allowed.",
      bodyEs: "Vos miraste para un lado. El cordón para el otro. Lena te espera en la sala con Paco en una mochila que no se puede." },
    { id: "startup", kind: "choice",
      title: "Val's last round", titleEs: "La última ronda de Val",
      body: "Val is pre-revenue, post-vibe, and asking friends. The whiteboard still says 'synergy'. Lena asks if this is the same Val from the food-truck year.",
      bodyEs: "Val está pre-revenue, post-vibe, y pide a los amigos. El pizarrón sigue diciendo «sinergia». Lena pregunta si es el mismo Val del año del food truck.",
      opts: [
        { k: "a", label: "Invest 20% of net worth", labelEs: "Invertir 20% del patrimonio" },
        { k: "b", label: "Pass", labelEs: "Paso" }
      ] },
    { id: "tow", kind: "report",
      title: "Nine-minute curb", titleEs: "Nueve minutos de cordón",
      body: "The sign said ten. They waited nine. Lena is already walking toward the lot with the spare key.",
      bodyEs: "El cartel decía diez. Esperaron nueve. Lena ya camina al playón con la llave de más." },
    { id: "romance", kind: "choice",
      title: "General on the phone", titleEs: "El general en el teléfono",
      body: "A decorated officer needs gas money to fly over with a vault key. Lena reads the chat and laughs once, which is worse than yelling.",
      bodyEs: "Un oficial con medallas necesita nafta para volar con la llave de una bóveda. Lena lee el chat y se ríe una vez, que es peor que gritar.",
      opts: [
        { k: "a", label: "Wire 10% of net worth", labelEs: "Girar 10% del patrimonio" },
        { k: "b", label: "Block and tell Lena", labelEs: "Bloquear y contarle a Lena" }
      ] },
    { id: "refund", kind: "report",
      title: "Quiet deposit", titleEs: "Depósito quieto",
      body: "They over-collected last quarter. Lena screenshots the amount for the shared note titled 'proof we are adults'.",
      bodyEs: "Cobrarón de más el trimestre pasado. Lena captura el monto para la nota compartida que se llama «prueba de que somos adultos»." },
    { id: "baby", kind: "choice",
      title: "Nico again", titleEs: "Nico otra vez",
      body: "Same cousin. New human. Smaller envelope, louder group chat. Sofi wants you to pick the onesie color.",
      bodyEs: "El mismo primo. Humano nuevo. Sobre más chico, grupo más ruidoso. Sofi quiere que elijas el color del body.",
      opts: [
        { k: "a", label: "Send 2% of net worth", labelEs: "Mandar 2% del patrimonio" },
        { k: "b", label: "Send a PDF of wishes", labelEs: "Mandar un PDF de deseos" }
      ] },
    { id: "flood", kind: "report",
      title: "Washer revolt", titleEs: "El lavarropas se revela",
      body: "The hose retires without notice. Basement lake. Paco supervises from the third step and does not help.",
      bodyEs: "La manguera se jubila sin aviso. Lago en el sótano. Paco supervisa desde el tercer escalón y no ayuda." },
    { id: "cousin", kind: "choice",
      title: "Nico's ticker", titleEs: "El ticker de Nico",
      body: "Nico cannot pronounce it and still says it 10xs by Friday. Lena leaves the room so she does not have to hear the pitch twice.",
      bodyEs: "Nico no lo puede pronunciar y igual dice que x10 para el viernes. Lena se va de la pieza para no escuchar el pitch dos veces.",
      opts: [
        { k: "a", label: "Put 40% of net worth in", labelEs: "Meter 40% del patrimonio" },
        { k: "b", label: "Keep the stack", labelEs: "Dejar el stack" }
      ] },
    { id: "speeding", kind: "report",
      title: "Same intersection", titleEs: "La misma esquina",
      body: "Flash. Letter. The camera has a better memory than you. Lena puts it on the fridge under the tax one.",
      bodyEs: "Flash. Carta. La cámara tiene mejor memoria que vos. Lena la pone en la heladera, debajo de la de rentas." },
    { id: "wallet", kind: "report",
      title: "Bus seat 14", titleEs: "Asiento 14 del bondi",
      body: "It was there. Then the next stop. Lena cancels the cards while Paco sniffs the empty pocket like evidence.",
      bodyEs: "Estaba. Después la parada. Lena cancela las tarjetas mientras Paco olfatea el bolsillo vacío como prueba." },
    { id: "potluck", kind: "choice",
      title: "Block stew", titleEs: "El guiso de la cuadra",
      body: "They are short on chairs and long on speeches. Lena already chopped onions. Paco will steal a napkin either way.",
      bodyEs: "Faltan sillas y sobran discursos. Lena ya picó cebolla. Paco se va a robar una servilleta igual.",
      opts: [
        { k: "a", label: "Donate 5% of net worth", labelEs: "Donar 5% del patrimonio" },
        { k: "b", label: "Bring nothing", labelEs: "No llevar nada" }
      ] },
    { id: "usedcar", kind: "choice",
      title: "Marker on the belt", titleEs: "Marcador en la correa",
      body: "A 2009 hatch. 'New timing belt' in marker. Marek knows the lot guy. Lena wants a second look at the tires.",
      bodyEs: "Un hatch 2009. «Correa nueva» a marcador. Marek conoce al de la agencia. Lena quiere mirar las gomas otra vez.",
      opts: [
        { k: "a", label: "Buy it · 12% of net worth", labelEs: "Comprarlo · 12% del patrimonio" },
        { k: "b", label: "Keep walking", labelEs: "Seguir de largo" }
      ] },
    { id: "dentist", kind: "report",
      title: "That molar", titleEs: "Esa muela",
      body: "It filed a formal complaint. Lena books the chair before you can invent an excuse. Paco waits in the car like a getaway driver.",
      bodyEs: "Presentó una queja formal. Lena reserva el sillón antes de que inventes una excusa. Paco espera en el auto como chofer de fuga." }
  ];

  function resolveChance(card, opt) {
    const es = chanceLang();
    const say = (en, esTxt) => (es ? esTxt : en);
    if (card.id === "landfill") {
      if (opt === "c") return say("You pass. The pendrive stays in the clay.", "Pasás. El pendrive se queda en la arcilla.");
      const pct = opt === "b" ? 0.75 : 0.25;
      const paid = takeWealthPct(pct);
      const r = Math.random();
      if (r < 0.08) {
        const got = Math.max(0.001, (wealthUsd() * (0.1 + Math.random() * 0.25)) / Math.max(S.price, 0.01));
        S.btc += got;
        return say("Mud, then plastic. A fragment of the 2009 dump. +" + got.toFixed(4) + " BTC. You spent " + money(paid) + ".",
          "Barro, después plástico. Un fragmento del basural de 2009. +" + got.toFixed(4) + " BTC. Gastaste " + money(paid) + ".");
      }
      if (r < 0.3) {
        const junk = grantWealthPct(0.015);
        return say("A Nokia and a loyalty card. +" + money(junk) + ". You spent " + money(paid) + ".",
          "Un Nokia y una tarjeta de puntos. +" + money(junk) + ". Gastaste " + money(paid) + ".");
      }
      return say("Three weeks of clay. Nothing. You spent " + money(paid) + ".",
        "Tres semanas de arcilla. Nada. Gastaste " + money(paid) + ".");
    }
    if (card.id === "taxbill") {
      const paid = cutPct(0.1);
      return say("Filed. −" + money(paid) + ".", "Presentado. −" + money(paid) + ".");
    }
    if (card.id === "wedding") {
      if (opt === "c") return say("You skip the hall. They skip your birthday.", "Te salteás el salón. Ellos tu cumple.");
      const paid = cutPct(opt === "a" ? 0.04 : 0.006);
      if (opt === "a") { S.cold += 1; return say("They toast you. −" + money(paid) + " and +1 cold storage.", "Brindan por vos. −" + money(paid) + " y +1 cold storage."); }
      return say("The meme lands. The envelope does not. −" + money(paid) + ".", "El meme llega. El sobre no. −" + money(paid) + ".");
    }
    if (card.id === "patagonia") {
      if (opt === "b") return say("You stay. The Andes do not mind.", "Te quedás. Los Andes no se ofenden.");
      const paid = cutPct(0.08);
      S.invuln = Math.max(S.invuln || 0, 4);
      return say("Lake air. −" + money(paid) + ". You feel hard to kill for a bit.", "Aire de lago. −" + money(paid) + ". Te sentís difícil de matar un rato.");
    }
    if (card.id === "flu") {
      const paid = cutPct(0.04);
      return say("Soup, tissues, two lost days. −" + money(paid) + ".", "Sopa, pañuelos, dos días perdidos. −" + money(paid) + ".");
    }
    if (card.id === "phish") {
      if (opt === "b") return say("Deleted. The domain was three letters off.", "Borrado. El dominio fallaba por tres letras.");
      const paid = cutPct(0.18);
      return say("The form was the drain. −" + money(paid) + ".", "El formulario era el desagüe. −" + money(paid) + ".");
    }
    if (card.id === "crash") {
      const paid = cutPct(0.06);
      return say("Insurance gap. −" + money(paid) + ".", "Hueco del seguro. −" + money(paid) + ".");
    }
    if (card.id === "casino") {
      if (opt === "c") return say("You keep your stack and your evening.", "Te quedás con el stack y con la noche.");
      const stake = cutPct(opt === "b" ? 0.3 : 0.1);
      if (Math.random() < 0.46) {
        S.cash += stake * 2;
        return say("The number hits. +" + money(stake * 2) + " back on a " + money(stake) + " stake.",
          "Sale el número. +" + money(stake * 2) + " sobre una apuesta de " + money(stake) + ".");
      }
      return say("The wheel does not know you. Stake " + money(stake) + " is gone.",
        "La rueda no te conoce. La apuesta de " + money(stake) + " se fue.");
    }
    if (card.id === "poker") {
      if (opt === "c") return say("The ship leaves. Your stack stays.", "El barco zarpa. Tu stack se queda.");
      const stake = cutPct(opt === "b" ? 0.25 : 0.08);
      const r = Math.random();
      if (r < 0.06) {
        S.cash += stake * 8;
        return say("Heads-up. You scoop the cruise. +" + money(stake * 8) + " on a " + money(stake) + " buy-in.",
          "Heads-up. Te llevás el crucero. +" + money(stake * 8) + " sobre un buy-in de " + money(stake) + ".");
      }
      if (r < 0.28) {
        S.cash += stake * 3;
        return say("Final table. +" + money(stake * 3) + " on a " + money(stake) + " buy-in.",
          "Mesa final. +" + money(stake * 3) + " sobre un buy-in de " + money(stake) + ".");
      }
      if (r < 0.52) {
        S.cash += stake * 1.4;
        return say("Min-cash. +" + money(stake * 1.4) + " on a " + money(stake) + " buy-in.",
          "Min-cash. +" + money(stake * 1.4) + " sobre un buy-in de " + money(stake) + ".");
      }
      return say("Busted on the river. Buy-in " + money(stake) + " feeds the rail.",
        "Eliminado en el river. El buy-in de " + money(stake) + " se queda en la baranda.");
    }
    if (card.id === "uncle") {
      if (Math.random() < 0.55) {
        const n = grantWealthPct(0.07);
        return say("Wire lands. +" + money(n) + ".", "Llega el giro. +" + money(n) + ".");
      }
      const b = Math.max(0.0001, (wealthUsd() * 0.07) / Math.max(S.price, 0.01));
      S.btc += b;
      return say("He sent sats. +" + b.toFixed(4) + " BTC.", "Mandó sats. +" + b.toFixed(4) + " BTC.");
    }
    if (card.id === "school") {
      if (opt === "b") return say("They go without your name on the form.", "Van sin tu nombre en la planilla.");
      const paid = cutPct(0.03);
      return say("You are on the chaperone list. −" + money(paid) + ".", "Estás en la lista de padres. −" + money(paid) + ".");
    }
    if (card.id === "roof") {
      const paid = cutPct(0.05);
      return say("Tarp, then tiles. −" + money(paid) + ".", "Lona, después tejas. −" + money(paid) + ".");
    }
    if (card.id === "lotto") {
      const r = Math.random();
      if (r < 0.04) { const n = grantWealthPct(0.35); return say("The lid was lucky. +" + money(n) + ".", "La tapa tenía suerte. +" + money(n) + "."); }
      if (r < 0.45) { const n = grantWealthPct(0.012); return say("Coffee-lid money. +" + money(n) + ".", "Plata de la tapa. +" + money(n) + "."); }
      return say("It was a loser under the foam.", "Era un perdedor bajo la espuma.");
    }
    if (card.id === "hospital") {
      const paid = cutPct(0.07);
      return say("Stitches hold. Invoice too. −" + money(paid) + ".", "Los puntos aguantan. La factura también. −" + money(paid) + ".");
    }
    if (card.id === "startup") {
      if (opt === "b") return say("You keep the stack. They keep the pitch deck.", "Te quedás el stack. Ellos el pitch.");
      const paid = cutPct(0.2);
      if (Math.random() < 0.28) {
        S.cash += paid * 4;
        return say("They actually ship. 4x back on " + money(paid) + ".", "De verdad publican. 4x sobre " + money(paid) + ".");
      }
      return say("The domain expired. " + money(paid) + " is a case study.", "Venció el dominio. " + money(paid) + " es un caso de estudio.");
    }
    if (card.id === "tow") {
      const paid = cutPct(0.02);
      return say("Lot fee plus pride. −" + money(paid) + ".", "Playón más orgullo. −" + money(paid) + ".");
    }
    if (card.id === "romance") {
      if (opt === "b") return say("Blocked. The general retreats.", "Bloqueado. El general se retira.");
      const paid = cutPct(0.1);
      return say("The vault key never boards. −" + money(paid) + ".", "La llave de la bóveda no aborda. −" + money(paid) + ".");
    }
    if (card.id === "refund") {
      const n = grantWealthPct(0.035);
      return say("Quiet deposit. +" + money(n) + ".", "Depósito quieto. +" + money(n) + ".");
    }
    if (card.id === "baby") {
      if (opt === "b") return say("You send a PDF of well wishes.", "Mandás un PDF de buenos deseos.");
      const paid = cutPct(0.02);
      return say("Onesie acquired. −" + money(paid) + ".", "Body comprado. −" + money(paid) + ".");
    }
    if (card.id === "flood") {
      const paid = cutPct(0.08);
      return say("Shop-vac and drywall. −" + money(paid) + ".", "Aspiradora de agua y yeso. −" + money(paid) + ".");
    }
    if (card.id === "cousin") {
      if (opt === "b") return say("The ticker is already −40% in after-hours.", "El ticker ya va −40% after hours.");
      const paid = cutPct(0.4);
      if (Math.random() < 0.5) {
        S.cash += paid * 2.2;
        return say("Friday arrives early. 2.2x on " + money(paid) + ".", "El viernes llega temprano. 2.2x sobre " + money(paid) + ".");
      }
      return say("Halted. " + money(paid) + " is a screenshot now.", "Suspendido. " + money(paid) + " ahora es un screenshot.");
    }
    if (card.id === "speeding") {
      const paid = cutPct(0.015);
      return say("Camera does not take excuses. −" + money(paid) + ".", "La cámara no acepta excusas. −" + money(paid) + ".");
    }
    if (card.id === "wallet") {
      const paid = cutPct(0.025);
      return say("Wallet walks. −" + money(paid) + ".", "Camina la billetera. −" + money(paid) + ".");
    }
    if (card.id === "potluck") {
      if (opt === "b") return say("You eat at home. Fine stew, thinner social graph.", "Comés en casa. Buen guiso, grafo social más fino.");
      const paid = cutPct(0.05);
      if (Math.random() < 0.35) { S.cold += 1; return say("Someone hands you a spare key. −" + money(paid) + " and +1 cold.", "Alguien te pasa una llave de más. −" + money(paid) + " y +1 cold."); }
      return say("You are on the good list. −" + money(paid) + ".", "Quedás en la lista buena. −" + money(paid) + ".");
    }
    if (card.id === "usedcar") {
      if (opt === "b") return say("The marker ink was still wet. Good call.", "La tinta del marcador todavía secaba. Buena.");
      const paid = cutPct(0.12);
      if (Math.random() < 0.3) {
        const back = grantWealthPct(0.03);
        return say("It runs. Spare tire sale. −" + money(paid) + " then +" + money(back) + ".", "Anda. Vendés el auxilio. −" + money(paid) + " y después +" + money(back) + ".");
      }
      const extra = cutPct(0.04);
      return say("Lemon. Timing belt was a rumor. −" + money(paid + extra) + ".", "Limón. La correa era un rumor. −" + money(paid + extra) + ".");
    }
    if (card.id === "dentist") {
      const paid = cutPct(0.03);
      return say("The molar stands down. −" + money(paid) + ".", "La muela se rinde. −" + money(paid) + ".");
    }
    return say("Nothing else happens.", "No pasa nada más.");
  }

  function dealChance() {
    if (S.phase !== "play") return;
    if (!S.chanceUsed) S.chanceUsed = {};
    const pool = CHANCE_CARDS.filter((c) => !S.chanceUsed[c.id]);
    const src = pool.length ? pool : CHANCE_CARDS;
    const card = src[(Math.random() * src.length) | 0];
    S.chanceUsed[card.id] = true;
    S.chanceCard = card;
    S.chanceNote = "";
    if (card.kind === "report") S.chanceNote = resolveChance(card, "ok");
    try { A.speak("Chance"); } catch (e) {}
    setPhase("chance");
  }

  function pickChance(opt) {
    const card = S.chanceCard;
    if (!card) { setPhase("play"); return; }
    if (card.kind === "choice" && !S.chanceNote) {
      S.chanceNote = resolveChance(card, opt);
      renderOverlay();
      renderHud();
      return;
    }
    S.chanceCard = null;
    S.chanceNote = "";
    setPhase("play");
  }

  function tickJobChance() {
    if ((S.have.job || 0) > 0 && S.candles > 0 && S.candles % 21 === 0) payJob();
    if ((S.have.chance || 0) > 0) {
      if (!S.chanceAt || !S.chanceAt.length) planChanceWindow(S.candles || 0);
      if (S.chanceAt && S.chanceAt.indexOf(S.candles) >= 0 && S.phase === "play") dealChance();
      if (S.chanceUntil && S.candles >= S.chanceUntil) planChanceWindow(S.candles);
    }
  }

  function perkOpen() {
    const ids = ["dca", "ff", "adopt", "manip", "candy", "juke", "aibud", "job", "market", "chance"].filter((id) => {
      const have = S.have[id] || 0;
      const max = PERK_MAX[id] || 10;
      if (id === "dca") return have <= 0;
      if (id === "aibud") {
        if (have >= max) return false;
        if (have === 2 && S.have.dca <= 0 && S.have.manip <= 0) return false;
        return true;
      }
      return have < max;
    });
    return ids;
  }

  function openPerkOffer(why) {
    const left = perkOpen();
    if (!left.length) return;
    rollPerks();
    if (!S.perkOffers || !S.perkOffers.length) return;
    if (S.perkOffers[S.perkOffers.length - 1] !== "skip") S.perkOffers.push("skip");
    S.perkPick = "";
    if (why === "laser") say("Tribonacci treshold achieved, choose your perk!", true);
    if (S.aibudOn && (S.have.aibud || 0) >= 2) {
      const real = S.perkOffers.filter((id) => id !== "skip");
      if (!real.length) { bumpOffer(); return; }
      const pick = bestAiPerk(real);
      grantPerk(pick.id);
      bumpOffer();
      aiAct("Perk " + perkTitle(pick.id, S.have[pick.id]), pick.why);
      return;
    }
    if (S.aibudOn && (S.have.aibud || 0) >= 1) {
      const pick = bestAiPerk(S.perkOffers.filter((id) => id !== "skip"));
      S.perkHint = pick && pick.id;
    } else S.perkHint = "";
    setPhase("perk");
  }

  function tribSeq(n) {
    const s = [1, 2, 4];
    while (s.length < n) {
      const i = s.length;
      s.push(s[i - 1] + s[i - 2] + s[i - 3]);
    }
    return s;
  }

  function bumpOffer() {
    S.offersDone += 1;
    if (S.ranked) {
      const s = S.offerSeq && S.offerSeq.length ? S.offerSeq : tribSeq(16);
      S.offerSeq = s;
      while (s.length <= S.offersDone) {
        const i = s.length;
        s.push(s[i - 1] + s[i - 2] + s[i - 3]);
      }
      S.nextOffer = s[S.offersDone];
      return;
    }
    const s = S.offerSeq;
    if (S.offersDone < s.length) S.nextOffer = s[S.offersDone];
    else {
      const n = 10 * (S.offersDone + 1);
      s.push(n);
      S.nextOffer = n;
    }
  }

  function rollPerks() {
    const ids = perkOpen();
    if (!ids.length) { S.perkOffers = []; return; }
    if (ids.length === 1) S.perkOffers = [ids[0]];
    else {
      const copy = ids.slice();
      const a = copy.splice((Math.random() * copy.length) | 0, 1)[0];
      const b = copy.splice((Math.random() * copy.length) | 0, 1)[0];
      S.perkOffers = [a, b];
    }
    if (S.perkOffers.indexOf("job") >= 0) pickJobOffer();
  }

  function perkWhy(id) {
    const es = window.BZ && BZ.lang && BZ.lang() === "es";
    if (id === "candy") return es ? "Más cash de velas para juntar sats" : "More candle cash to stack sats";
    if (id === "dca") return es ? "El ingreso se vuelve bitcoin" : "Income becomes bitcoin";
    if (id === "adopt") return es ? "Bulls más gordos, bears más suaves" : "Fatter bulls, milder bears";
    if (id === "manip") return es ? "Mover el precio si holdeamos" : "Steer price while we hold";
    if (id === "aibud") return es ? "A.I. bud sube de nivel" : "A.I. bud levels up";
    if (id === "ff") return es ? "Más tablero, más monedas" : "More board, more coins";
    if (id === "juke") return es ? "Música mientras stackeamos" : "Tunes while we stack";
    if (id === "job") return es ? "Sueldo fijo cada 21 velas" : "Steady paycheck every 21 candles";
    if (id === "market") return es ? "Comprar vidas y láseres" : "Buy lives and lasers";
    if (id === "chance") return es ? "Cartas cada 210 velas" : "Cards every 210 candles";
    return es ? "Lo mejor para juntar bitcoin" : "Best for stacking bitcoin";
  }

  function bestAiPerk(ids) {
    const score = (id) => {
      if (id === "aibud" && (S.have.aibud || 0) >= 1) return 90;
      if (id === "dca" && S.have.dca <= 0) return 88;
      if (id === "candy") return 80;
      if (id === "adopt") return 74;
      if (id === "manip" && S.btc > 0) return 70;
      if (id === "manip") return 55;
      if (id === "ff") return 40;
      if (id === "juke") return 28;
      if (id === "job") return 60;
      if (id === "market") return 50;
      if (id === "chance") return 52;
      if (id === "aibud") return 86;
      return 10;
    };
    let best = ids[0], bestS = -1;
    ids.forEach((id) => {
      const n = score(id);
      if (n > bestS) { bestS = n; best = id; }
    });
    return { id: best, why: perkWhy(best) };
  }

  function aiLocks() {
    const t = S.have.aibud || 0;
    return {
      dca: !!(S.aibudOn && t >= 3 && S.have.dca > 0),
      trend: !!(S.aibudOn && t >= 3 && S.have.manip > 0),
      trade: !!(S.aibudOn && t >= 4)
    };
  }

  function aiAct(act, why) {
    if (!S.iaLog) S.iaLog = [];
    S.iaLog.unshift({ t: S.lifeT, act: act, why: why || "", btc: netBtc(), candles: S.candles || 0 });
    if (S.iaLog.length > 48) S.iaLog.pop();
    if (A.sfx && A.sfx.iabud) A.sfx.iabud();
  }

  function aiTradeGap() {
    const t = S.have.aibud || 0;
    if (t >= 6) return 2;
    if (t >= 5) return 5;
    if (t >= 4) return 10;
    return 9999;
  }

  function canAiTrade() {
    return (S.candles || 0) - (S.aiTradeAt == null ? -9999 : S.aiTradeAt) >= aiTradeGap();
  }

  function markAiTrade() {
    if (S.aiTimingStart == null) {
      S.aiTimingStart = S.lifeT;
      S.aiTimingLast = S.lifeT;
      say("A.I bud is timing the market for you!", true, "aibud");
    }
  }

  function tickAiTiming() {
    if (S.aiTimingStart == null || S.phase !== "play") return;
    if ((S.aiTimingLast || 0) && S.lifeT - S.aiTimingLast < 60) return;
    if (!S.aiTimingLast && S.lifeT - S.aiTimingStart < 60) return;
    S.aiTimingLast = S.lifeT;
    say("A.I bud is timing the market for you!", true, "aibud");
  }

  function incomingKind(kinds, horizon) {
    const m = metrics();
    let speed = m.speed * scrollMul();
    if (S.power === "BULL" || S.power === "BEAR" || S.laserOn) speed *= 1.28;
    for (const it of S.items) {
      if (kinds.indexOf(it.type) < 0) continue;
      const eta = (it.x - S.bird.x) / Math.max(40, speed);
      if (eta > 0.12 && eta < horizon) return it;
    }
    return null;
  }

  function cycleU() {
    return Math.min(1, S.cycleElapsed / Math.max(0.001, S.cycleDur));
  }

  function tickAi(dt) {
    if (!S.aibudOn || S.phase !== "play" || (S.have.aibud || 0) < 3) return;
    S.aiAcc = (S.aiAcc || 0) + dt;
    tickAiTiming();
    if (S.aiAcc < 0.22) return;
    S.aiAcc = 0;
    const t = S.have.aibud;
    const incomingBad = incomingKind(["BEAR", "SWAN"], 2.4);
    const incomingGood = incomingKind(["BULL", "HALVE"], 2.4);
    const u = cycleU();
    const bullPeak = S.power === "BULL" && u > 0.66;
    const bearLow = S.power === "BEAR" && u > 0.58;
    const dumpSoon = !!(incomingBad || bullPeak || (S.power === "BULL" && S.powerT < 1.15));
    const dipSoon = !!(incomingGood || bearLow || S.swanBear || (S.power === "BEAR" && S.powerT < 1.2));

    if (t >= 4 && canAiTrade()) {
      const bag = netBtc();
      if (S.btc > 0 && dumpSoon) {
        S.aiSilent = true; sellBtc(); S.aiSilent = false;
        S.iaProfit += netBtc() - bag;
        S.aibudLit = Object.assign({}, S.aibudLit, { sell: true, buy: false });
        S.aiTradeAt = S.candles || 0;
        markAiTrade();
        aiAct("Sold BTC", incomingBad ? "Dump incoming · stack more later" : "Sold the peak · stack more later");
      } else if (S.cash > 0 && S.btc <= 0 && (dipSoon || S.power !== "BULL")) {
        S.aiSilent = true; buyBtc(); S.aiSilent = false;
        S.iaProfit += netBtc() - bag;
        S.aibudLit = Object.assign({}, S.aibudLit, { buy: true, sell: false });
        S.aiTradeAt = S.candles || 0;
        markAiTrade();
        aiAct("Bought BTC", incomingGood ? "Pump incoming · accumulate" : "Bought the dip · accumulate");
      }
    }
    if (t >= 3 && S.have.dca > 0) {
      const want = !!(S.btc <= 0 || S.power === "BEAR" || S.swanBear || incomingBad || dipSoon);
      if (want !== S.dcaOn) {
        S.dcaOn = want;
        S.aibudLit = Object.assign({}, S.aibudLit, { dca: true });
        aiAct(want ? "DCA ON" : "DCA OFF", want ? "Income to bitcoin" : "Do not buy the top");
      }
    }
    if (t >= 3 && S.have.manip > 0) {
      const want = S.btc > 0 ? "up" : "down";
      if (want !== S.trend) {
        S.trend = want;
        S.aibudLit = Object.assign({}, S.aibudLit, { trend: true });
        aiAct(want === "up" ? "Trend UP" : "Trend DOWN", want === "up" ? "Pump the bag" : "Cheaper next buy");
      }
    }
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
    S.countN = 3; setPhase("count");
    if (A && A.sfx && A.sfx.count) A.sfx.count();
    clearInterval(countTimer);
    countTimer = setInterval(() => {
      S.countN -= 1;
      if (S.countN <= 0) {
        clearInterval(countTimer);
        if (A && A.sfx && A.sfx.go) A.sfx.go();
        setPhase("play");
      } else {
        if (A && A.sfx && A.sfx.count) A.sfx.count();
        renderOverlay();
      }
    }, 1000);
  }

  function setPhase(p) {
    S.phase = p;
    try {
      const jukeLive = S.jukeOn && A && A.jukePlaying && A.jukePlaying();
      if (A) {
        if (p === "play") {
          if (S.jukeOn && A.jukePaused && A.jukePaused()) A.jukeResume();
          else if (!jukeLive && A.startMusic) A.startMusic(() => S.power, () => S.phase === "play");
        } else if (A.stopMusic) A.stopMusic();
      }
    } catch (e) {}
    if (field) {
      field.classList.toggle("bull", S.power === "BULL");
      field.classList.toggle("bear", S.power === "BEAR");
      field.classList.toggle("swan-bear", S.power === "BEAR" && S.swanBear);
      field.classList.toggle("perk-ui", p === "perk" || p === "chance");
      field.classList.toggle("is-play", p === "play");
    }
    try { renderOverlay(); } catch (e) { if (p !== "play") showOverlay(); }
    try { renderHud(); } catch (e) {}
  }

  function startGame(ranked) {
    S.ranked = ranked !== false;
    if (A && A.unlock) try { A.unlock(); } catch (e) {}
    if (A && A.sfx && A.sfx.start) try { A.sfx.start(); } catch (e) {}
    S.humanInput = true;
    S.introCounted = true;
    if (!S.welcomed) {
      S.welcomed = true;
      try {
        A.speak("Welcome to Choppy Bitcoin: Survive the market!");
        S.ticker = t("welcome");
        S.tickerT = 3;
      } catch (e) {}
    }
    resetWorld(false);
    S.dead = false;
    S.phase = "play";
    if (field) field.classList.add("is-play");
    if (overlay) hideOverlay();
    if (field) field.style.pointerEvents = "auto";
    if (canvas) canvas.style.pointerEvents = "auto";
    if (A && A.startMusic) {
      try { A.startMusic(() => S.power, () => S.phase === "play"); } catch (e) {}
    }
    renderHud();
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
      const amp = S.cycleAmp || (S.halveBull ? 0.62 : 0.275);
      const wobble = Math.sin(S.cycleElapsed * 3.2) * (S.halveBull ? 0.05 : 0.03);
      S.price = Math.max(0.01, S.cycleStart * (1 + dir * amp * envelope + wobble));
      if (S.level >= 2) S.vtPrice = Math.max(1, S.vtCycle * (1 + dir * (S.halveBull ? 0.22 : 0.125) * envelope + wobble * 0.45));
      if (S.powerT <= 0) endCycle();
    } else {
      let bias = 0.0006, mid = 0.48;
      if (S.have.manip > 0) {
        const k = S.have.manip;
        if (S.trend === "up") { bias = 0.004 * k; mid = Math.max(0.22, 0.42 - 0.02 * k); }
        else if (S.trend === "down") { bias = -0.004 * k; mid = Math.min(0.78, 0.42 + 0.02 * k); }
        else { bias = 0; mid = 0.5; }
      } else {
        bias = 0.0006 * (1 + (Math.random() * 2 - 1) * 0.05);
      }
      S.price = Math.max(0.01, S.price + (Math.random() - mid) * S.price * 0.012 * dt + S.price * bias * dt);
      if (S.level >= 2) S.vtPrice = Math.max(1, S.vtPrice + (Math.random() - 0.45) * S.vtPrice * 0.01 * dt + S.vtPrice * 0.0012 * dt);
    }
    S.lifeT += dt; S.sampleAcc += dt;
    tickAi(dt);
    while (S.sampleAcc >= 0.12) {
      S.tape.push(S.price);
      if (S.level >= 2) S.tapeVt.push(S.vtPrice);
      S.sampleAcc -= 0.12;
    }
    if (!S.hitCap && netBtc() >= 21e6) {
      S.hitCap = true; A.sfx.cap();
      A.speak(t("floatYours"), true);
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
    if (S.bird.y - S.bird.r > S.H) {
      if (S.invuln > 0) {
        S.bird.y = Math.min(S.H - 70, S.H - S.bird.r - 8);
        S.bird.v = metrics().jump * 0.7;
      } else {
        hitFatal();
        if (S.dead) return;
      }
    }
    if (S.bird.y + S.bird.r < 0) { S.bird.y = -S.bird.r + 1; S.bird.v = 0; }

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
        tickJobChance();
        if (!S.ranked && S.candles > 0 && S.candles % 10 === 0) openPerkOffer();
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
      if (it.type !== "HALVE") {
        it.y += (it.vy || 0) * dt;
        const lo = it.lo != null ? it.lo : 20;
        const hi = it.hi != null ? it.hi : S.H - 20;
        if (it.y <= lo) { it.y = lo; it.vy = Math.abs(it.vy || 26); }
        else if (it.y >= hi) { it.y = hi; it.vy = -Math.abs(it.vy || 26); }
      }
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
      SWAN: { fill: "#f3efe6", ring: "#1a1a1c", ink: "#0a0a0c" },
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
    const bucket = 4, cw = 4.75, stepX = 5.1;
    const maxFit = Math.max(10, Math.floor((S.W * 0.78) / stepX));
    const buckets = [];
    for (let i = 0; i < data.length; i += bucket) {
      const sl = data.slice(i, i + bucket);
      if (!sl.length) continue;
      const o = buckets.length ? buckets[buckets.length - 1].c : sl[0];
      buckets.push({ o: o, h: Math.max.apply(null, sl), l: Math.min.apply(null, sl), c: sl[sl.length - 1] });
    }
    const vis = buckets.length > maxFit ? buckets.slice(buckets.length - maxFit) : buckets;
    if (!vis.length) return;
    let lo = vis[0].l, hi = vis[0].h;
    for (const b of vis) { if (b.l < lo) lo = b.l; if (b.h > hi) hi = b.h; }
    const pad = (hi - lo) * 0.08 || 1;
    lo -= pad; hi += pad;
    if (S.tapeLo == null) { S.tapeLo = lo; S.tapeHi = hi; }
    S.tapeLo = S.tapeLo * 0.88 + lo * 0.12;
    S.tapeHi = S.tapeHi * 0.88 + hi * 0.12;
    const py = (v) => y1 - ((v - S.tapeLo) / Math.max(0.01, S.tapeHi - S.tapeLo)) * (y1 - y0);
    vis.forEach((b, i) => {
      const x = 10 + i * stepX;
      ctx.strokeStyle = b.c >= b.o ? up : dn; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + cw / 2, py(b.h)); ctx.lineTo(x + cw / 2, py(b.l)); ctx.stroke();
      ctx.fillStyle = b.c >= b.o ? up : dn;
      ctx.fillRect(x, Math.min(py(b.o), py(b.c)), cw, Math.max(1.2, Math.abs(py(b.c) - py(b.o))));
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
    drawTape(ctx, S.tape, S.H * 0.196, S.H * 0.804, "rgba(79,157,110,0.52)", "rgba(196,92,74,0.52)");

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

  const GAME_W = 480;
  const GAME_H = 640;

  let fitW = 0, fitH = 0, fitCtx = null;
  function fit() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = GAME_W, H = GAME_H;
    S.W = W; S.H = H;
    if (fitCtx && W === fitW && H === fitH) return fitCtx;
    fitW = W; fitH = H;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    fitCtx = canvas.getContext("2d");
    fitCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return fitCtx;
  }

  function layoutStage() {
    const app = $("app");
    if (!app) return;
    app.style.transform = "none";
    const baseW = GAME_W;
    const baseH = app.offsetHeight || (GAME_H + 160);
    const pad = 8;
    const inset = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    const viewW = (window.visualViewport && window.visualViewport.width) || window.innerWidth;
    const viewH = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    const sx = (viewW - pad) / baseW;
    const sy = (viewH - pad - inset) / baseH;
    const s = Math.max(0.35, Math.min(sx, sy));
    app.style.transform = "scale(" + s + ")";
  }

  function renderHud() {
    const clock = $("clock");
    if (clock) {
      clock.textContent = fmtTime(S.lifeT);
      clock.classList.toggle("hide", S.phase === "ready" || S.phase === "count");
    }
    setTxt("h-cash", money(S.cash));
    setTxt("h-btc", fmtBtcAmt(S.btc));
    setTxt("h-price", money(S.price));
    setTxt("h-cold", String(S.cold));
    setTxt("h-msig", String(S.msig));
    setTxt("h-laser", String(S.lasers));
    setTxt("h-halve", String(S.halveLeft));
    setTxt("h-halves", String(S.halvings) + "/" + HALVE_N);
    const bonus = S.level >= 2;
    $("hud").className = "hud-grid hud-4";
    const lockBtn = (id, ready) => {
      const el = $(id);
      if (!el) return;
      el.disabled = !ready;
      el.classList.toggle("locked", !ready);
    };
    lockBtn("spd-2", S.have.ff > 0);
    const spd2 = $("spd-2");
    if (spd2) {
      const mx = ffMax();
      const fast = S.have.ff > 0 && S.speedMul !== 1;
      spd2.textContent = fast ? ((mx % 1 ? mx.toFixed(1) : String(mx)) + "x") : "1x";
      spd2.classList.add("on");
    }
    lockBtn("dca-btn", S.have.dca > 0);
    lockBtn("iabud-btn", (S.have.aibud || 0) > 0);
    lockBtn("trend-btn", S.have.manip > 0);
    lockBtn("market-btn", (S.have.market || 0) > 0);
    const locks = aiLocks();
    const dca = $("dca-btn");
    if (dca) {
      dca.classList.toggle("on", S.dcaOn);
      dca.classList.toggle("ai-lit", !!(S.aibudLit && S.aibudLit.dca && S.dcaOn));
      dca.classList.toggle("ai-lock", locks.dca);
      dca.disabled = S.have.dca <= 0 || locks.dca;
      dca.textContent = S.dcaOn ? t("dcaOn") : t("dcaOff");
      dca.setAttribute("aria-pressed", S.dcaOn ? "true" : "false");
    }
    const bud = $("iabud-btn");
    if (bud) {
      bud.classList.toggle("on", S.aibudOn);
      bud.disabled = (S.have.aibud || 0) <= 0;
      bud.textContent = S.aibudOn ? t("aiOn") : t("aiOff");
      bud.setAttribute("aria-pressed", S.aibudOn ? "true" : "false");
    }
    const tr = $("trend-btn");
    if (tr) {
      const lab = S.trend === "up" ? t("trendUp") : S.trend === "down" ? t("trendDown") : t("trendOff");
      tr.textContent = lab;
      tr.classList.toggle("on", S.trend !== "off");
      tr.classList.toggle("ai-lit", !!(S.aibudLit && S.aibudLit.trend && S.trend !== "off"));
      tr.classList.toggle("ai-lock", locks.trend);
      tr.disabled = S.have.manip <= 0 || locks.trend;
    }
    const buy = $("buy-btc"), sell = $("sell-btc");
    if (buy) {
      buy.disabled = locks.trade;
      buy.classList.toggle("ai-lock", locks.trade);
      buy.classList.toggle("ai-lit", !!(S.aibudLit && S.aibudLit.buy));
      buy.textContent = t("buyBtc");
    }
    if (sell) {
      sell.disabled = locks.trade;
      sell.classList.toggle("ai-lock", locks.trade);
      sell.classList.toggle("ai-lit", !!(S.aibudLit && S.aibudLit.sell));
      sell.textContent = t("sellBtc");
    }
    const pauseBtn = $("pause-btn");
    if (pauseBtn) {
      const paused = S.phase === "paused" || S.phase === "perk";
      pauseBtn.textContent = paused ? "▶" : "||";
      pauseBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
    }
    if (S.have.ff <= 0) S.speedMul = 1;
    const playing = S.phase === "play" || S.phase === "paused" || S.phase === "perk";
    $("trades").classList.toggle("hide", !playing);
    $("pause-btn").classList.toggle("hide", !playing);
    let status = "";
    if (S.halveBull) status = t("halvingNow") + "  " + Math.ceil(S.powerT) + "s";
    else if (S.power === "BULL") status = t("bullRun") + "  " + Math.ceil(S.powerT) + "s";
    else if (S.power === "BEAR") status = t("bearCrash") + "  " + Math.ceil(S.powerT) + "s";
    if (S.jobName) status = status ? status + "  ·  " + S.jobName : S.jobName;
    if (S.laserOn) status = status ? status + "  ·  " + t("laserNow") + " " + Math.ceil(S.laserT) + "s" : t("laserNow") + "  " + Math.ceil(S.laserT) + "s";
    $("status").textContent = status;
    $("status").classList.toggle("hide", !(status && S.phase === "play"));
    const cap = $("caption");
    if (cap) {
      cap.textContent = S.ticker || "";
      cap.classList.toggle("hide", !S.ticker || S.phase !== "play");
    }
    paintJukeUi();
  }

  function paintJukeUi() {
    const bar = $("juke-bar");
    if (bar && A.jukeProgress) bar.style.width = Math.round((A.jukeProgress().pct || 0) * 100) + "%";
    const stage = $("lyric-stage");
    const titleEl = $("lyric-title");
    const prevEl = $("lyric-prev");
    const nowEl = $("lyric-now");
    const nextEl = $("lyric-next");
    const np = $("now-playing");
    const live = S.jukeOn && A.jukePlaying && (A.jukePlaying() || (A.jukePaused && A.jukePaused()));
    const id = (S.jukeList || [])[S.jukeTrack];
    const song = id && A.SONGS && A.SONGS[id];
    const cues = (song && song.lyrics) || [];
    const onField = S.phase === "play" || S.phase === "paused";
    const want = false;
    if (np) {
      np.textContent = "";
      np.classList.add("hide");
    }
    if (!stage) return;
    stage.classList.toggle("hide", !want);
    if (!want) return;
    const pct = A.jukeProgress ? (A.jukeProgress().pct || 0) : 0;
    let i = 0;
    while (i + 1 < cues.length && cues[i + 1].p <= pct + 0.001) i++;
    if (titleEl) titleEl.textContent = song.title || "";
    if (prevEl) prevEl.textContent = cues[i - 1] ? cues[i - 1].text : "";
    if (nextEl) nextEl.textContent = cues[i + 1] ? cues[i + 1].text : "";
    if (!nowEl) return;
    if (!cues.length) { nowEl.textContent = ""; return; }
    const words = String(cues[i].text || "").split(/\s+/).filter(Boolean);
    const end = cues[i + 1] ? cues[i + 1].p : 1;
    const span = Math.max(0.001, end - cues[i].p);
    const local = Math.max(0, Math.min(1, (pct - cues[i].p) / span));
    const wi = words.length ? Math.min(words.length - 1, Math.floor(local * words.length)) : 0;
    nowEl.innerHTML = words.map((w, k) => "<span class=\"w" + (k < wi ? " on" : k === wi ? " hot" : "") + "\">" + w + "</span>").join(" ");
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
  const AWARD_CATALOG = [
    { id: "maxi", name: "Maxi Soul", nameEs: "Alma maxi", why: "Never sold BTC — not by hand, not by A.I. bud.", whyEs: "Nunca vendió BTC, ni a mano ni por A.I. bud." },
    { id: "halver", name: "Halving Catcher", nameEs: "Atrapa halvings", why: "Every halving that spawned was eaten.", whyEs: "Comió todos los halvings que salieron." },
    { id: "nocoiner", name: "Nocoiner", nameEs: "Nocoiner", why: "Never bought BTC in that run.", whyEs: "Nunca compró BTC en esa partida." },
    { id: "greedy", name: "Greedy Miner", nameEs: "Minero greedy", why: "Ate 0 halvings.", whyEs: "Comió 0 halvings." },
    { id: "opsec", name: "Opsec Warrior", nameEs: "Guerrero opsec", why: "Lost 0 cold storage.", whyEs: "No perdió cold storage." },
    { id: "paper", name: "Paper Hands", nameEs: "Manos de papel", why: "Sold BTC in a bear market.", whyEs: "Vendió BTC en un bear market." }
  ];
  function awardName(a) {
    return (window.BZ && BZ.lang && BZ.lang() === "es") ? (a.nameEs || a.name) : a.name;
  }
  function awardWhy(a) {
    return (window.BZ && BZ.lang && BZ.lang() === "es") ? (a.whyEs || a.why) : a.why;
  }
  function awardStore() {
    try { return JSON.parse(localStorage.getItem("choppy-awards") || "{}"); } catch (e) { return {}; }
  }
  function awardOwner() {
    return (window.choppyUserId || "guest");
  }
  function loadAwards() {
    const bag = awardStore();
    return bag[awardOwner()] || {};
  }
  function saveAwards(map) {
    const bag = awardStore();
    bag[awardOwner()] = map;
    localStorage.setItem("choppy-awards", JSON.stringify(bag));
    if (typeof window.persistAwards === "function") window.persistAwards(Object.keys(map).filter((k) => map[k]));
  }
  function mergeAwards(ids) {
    if (!S.ranked) return loadAwards();
    const map = loadAwards();
    (ids || []).forEach((id) => { map[id] = true; });
    saveAwards(map);
    return map;
  }
  function runAwardIds(st) {
    if (!st || (st.candles || 0) < 420) return [];
    const out = [];
    if ((st.sells || 0) === 0) out.push("maxi");
    if ((st.halveMiss || 0) === 0 && (st.halvings || 0) > 0) out.push("halver");
    if (!st.boughtBtc) out.push("nocoiner");
    if ((st.halvings || 0) === 0) out.push("greedy");
    if ((st.coldLost || 0) === 0) out.push("opsec");
    if ((st.sellsBear || 0) >= 1) out.push("paper");
    return out;
  }
  function runAwards(st) {
    return runAwardIds(st).map((id) => AWARD_CATALOG.find((a) => a.id === id)).filter(Boolean);
  }
  function awardListHtml(owned, mode) {
    owned = owned || loadAwards();
    const es = window.BZ && BZ.lang && BZ.lang() === "es";
    const rows = AWARD_CATALOG.filter((a) => mode !== "owned" || owned[a.id]).map((a) => {
      const on = !!owned[a.id];
      return "<p class=\"" + (on ? "aw-on" : "aw-off") + "\"><b>" + (on ? "✓ " : "○ ") + awardName(a) + "</b> — " + awardWhy(a) + "</p>";
    }).join("");
    if (mode === "owned") {
      const n = AWARD_CATALOG.filter((a) => owned[a.id]).length;
      return "<details class=\"aw-box\"><summary>" + (es ? "Premios" : "Awards") + " (" + n + ")</summary>" + (rows || "<p>" + (es ? "Todavía no hay premios." : "No awards yet.") + "</p>") + "</details>";
    }
    return "<div class=\"awards\"><p class=\"k\">" + (es ? "Premios" : "Awards") + "</p>" + rows + "</div>";
  }
  function shareRun(kind) {
    const btc = fmtBtc(netBtc());
    const names = runAwards(S.stats || collectRunStats()).map((a) => awardName(a)).join(", ");
    let who = (window.choppyUsername || "").trim();
    if (!who) {
      const tagEl = $("user-profile-tag");
      const raw = tagEl && !tagEl.classList.contains("hide") ? (tagEl.textContent || "") : "";
      who = raw.replace(/^@/, "").replace(/\s.*/, "").trim();
    }
    who = who.replace(/^@/, "");
    const tag = who ? "@" + who + " " : "";
    const es = window.BZ && BZ.lang && BZ.lang() === "es";
    const text = kind === "win"
      ? (es
        ? tag + "juntó 21M en Choppy Bitcoin. Bag " + btc + (names ? " Premios: " + names : "")
        : tag + "stacked 21M on Choppy Bitcoin. Bag " + btc + (names ? " Awards: " + names : ""))
      : (es
        ? tag + "quedó rekt en Choppy Bitcoin. Bag " + btc + ". Jugá gratis en Bitcoinizate."
        : tag + "got rekt on Choppy Bitcoin. Bag " + btc + ". Play free on Bitcoinizate.");
    const url = "https://bitcoinizate.com/choppy-bitcoin/";
    const imgUrl = "https://bitcoinizate.com/choppy-bitcoin/share-icon.png";
    const goTweet = () => {
      window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text + " " + url), "_blank", "noopener");
    };
    const payload = { title: "Choppy Bitcoin", text: text, url: url };
    const send = (data) => {
      if (!navigator.share) { goTweet(); return; }
      navigator.share(data).catch(goTweet);
    };
    if (navigator.canShare) {
      fetch("share-icon.png").then((r) => r.blob()).then((blob) => {
        const file = new File([blob], "choppy-bitcoin.png", { type: blob.type || "image/png" });
        const withFile = { title: payload.title, text: payload.text, url: payload.url, files: [file] };
        if (navigator.canShare(withFile)) send(withFile);
        else send(payload);
      }).catch(() => send(payload));
      return;
    }
    send(payload);
  }
  window.CHOPPY_AWARDS = AWARD_CATALOG;
  window.choppyAwardHtml = () => awardListHtml(loadAwards(), "owned");
  window.mergeChoppyAwards = mergeAwards;
  function jukeLyricsOn() { return localStorage.getItem("choppy-juke-lyrics") === "1"; }
  function setJukeLyrics(on) { localStorage.setItem("choppy-juke-lyrics", on ? "1" : "0"); }
  function jukeEnabledList() {
    if (!S.jukeOff) S.jukeOff = {};
    return (S.jukeList || []).filter((id) => !S.jukeOff[id]);
  }
  function fillJukebox() {
    const all = (A && A.JUKE_CORE && A.JUKE_CORE.slice()) || Object.keys((A && A.SONGS) || {});
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
      if (A && A.jukeStop) A.jukeStop();
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
      return "<h1>" + t("howPlay") + "</h1>" + tutorialBody() + "<button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
    }
    if (panel === "market") {
      return "<h1>" + t("market") + "</h1>"
        + "<p class=\"k\">" + money(S.cash) + "</p>"
        + "<button class=\"cta\" data-buy=\"cold\">Cold storage · $1,200</button>"
        + "<button class=\"cta\" data-buy=\"laser\">Laser eyes · $1,800</button>"
        + "<button class=\"cta\" data-buy=\"msig\">Multisig · $9,000</button>"
        + "<button class=\"cta play-alt\" id=\"help-back\">" + t("back") + "</button>";
    }
    if (panel === "feed") {
      return "<h1>" + t("feedback") + "</h1>"
        + "<textarea id=\"feed-text\" rows=\"5\" style=\"width:100%;max-width:360px;background:#0a0a0c;color:#f3efe6;border:1px solid #3a3a40;padding:8px;font:inherit\"></textarea>"
        + "<p class=\"k\" id=\"feed-msg\"></p>"
        + "<button class=\"cta\" id=\"feed-send\">" + t("send") + "</button>"
        + "<button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
    }
    if (panel === "aibud") {
      if ((S.have.aibud || 0) <= 0) {
        return "<h1>" + t("aiLog") + "</h1><p>" + t("aiNeed") + "</p><button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
      }
      const rows = (S.iaLog || []).map((e) => {
        const sec = Math.floor(e.t);
        return "<p><span class=\"ia-act\">" + e.act + "</span> — " + e.why + " <span class=\"k\">" + sec + "s · " + fmtBtc(e.btc != null ? e.btc : 0) + "</span></p>";
      }).join("") || "<p>" + t("noAiCalls") + "</p>";
      return "<h1>" + t("aiLog") + "</h1><p class=\"k\">" + t("markedPl") + " " + fmtBtc(S.iaProfit || 0) + " · T" + (S.have.aibud || 0) + "</p><div class=\"awards\">" + rows + "</div><button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
    }
    if (panel === "juke") {
      if ((S.have.juke || 0) <= 0) {
        return "<h1>" + t("jukebox") + "</h1><p>" + t("jukeNeed") + "</p><button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
      }
      fillJukebox();
      const id = S.jukeList[S.jukeTrack] || "";
      const live = !!(A.jukePlaying && A.jukePlaying());
      const paused = !!(A.jukePaused && A.jukePaused());
      const song = A.SONGS && A.SONGS[id];
      const rows = S.jukeList.map((sid, i) => {
        const t = (A.SONGS && A.SONGS[sid] && A.SONGS[sid].title) || sid;
        const off = S.jukeOff && S.jukeOff[sid];
        return "<div class=\"juke-line" + (i === S.jukeTrack ? " on" : "") + (off ? " dim" : "") + "\">"
          + "<button type=\"button\" class=\"juke-track\" data-juke=\"" + i + "\">" + t + "</button>"
          + "<button type=\"button\" class=\"juke-arm" + (off ? " off" : " on") + "\" data-skip=\"" + sid + "\" aria-label=\"" + (off ? "Enable" : "Disable") + "\">" + (off ? "✕" : "✓") + "</button>"
          + "</div>";
      }).join("");
      const rpt = S.jukeRepeat || "off";
      return "<h1>" + t("jukebox") + "</h1><div class=\"juke retro\">"
        + "<p class=\"juke-lab\">Retro Jukebox</p>"
        + "<p class=\"juke-now\">" + (song ? song.title : id) + "</p>"
        + "<p class=\"juke-gen\">" + (song && song.genre ? song.genre : "") + "</p>"
        + "<div class=\"juke-row\">"
        + "<button type=\"button\" class=\"juke-btn ico\" id=\"juke-prev\" aria-label=\"Previous\">⏮</button>"
        + "<button type=\"button\" class=\"juke-btn ico juke-play" + (live ? " on" : "") + "\" id=\"juke-play\" aria-label=\"Play\">▶</button>"
        + "<button type=\"button\" class=\"juke-btn ico" + (paused ? " on" : "") + "\" id=\"juke-pause\" aria-label=\"Pause\">❚❚</button>"
        + "<button type=\"button\" class=\"juke-btn ico\" id=\"juke-next\" aria-label=\"Next\">⏭</button>"
        + "</div>"
        + "<div class=\"juke-prog\"><div class=\"juke-prog-bar\" id=\"juke-bar\"></div></div>"
        + "<div class=\"juke-row\">"
        + "<button type=\"button\" class=\"juke-btn ico" + (S.jukeShuffle ? " on" : "") + "\" id=\"juke-shuf\" aria-label=\"Shuffle\">🔀</button>"
        + "<button type=\"button\" class=\"juke-btn ico" + (rpt !== "off" ? " on" : "") + "\" id=\"juke-rep\" aria-label=\"Repeat\">" + (rpt === "one" ? "🔂" : "🔁") + "</button>"
        + "</div>"
        + "<div class=\"juke-list\">" + rows + "</div>"
        + "</div><button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
    }
    if (panel === "sound") {
      const themeOn = !A.muteTheme();
      const sfxOn = !A.muteSfx();
      const voiceOn = !A.muteVoice();
      return "<h1>" + t("sound") + "</h1><div class=\"mute-row\">"
        + "<button type=\"button\" class=\"mute-tog" + (themeOn ? "" : " on") + "\" id=\"mute-theme\">" + t("bullSongs") + " " + (themeOn ? t("soundOn") : t("soundOff")) + "</button>"
        + "<button type=\"button\" class=\"mute-tog" + (sfxOn ? "" : " on") + "\" id=\"mute-sfx\">" + t("gameFx") + " " + (sfxOn ? t("soundOn") : t("soundOff")) + "</button>"
        + "<button type=\"button\" class=\"mute-tog" + (voiceOn ? "" : " on") + "\" id=\"mute-voice\">" + t("voices") + " " + (voiceOn ? t("soundOn") : t("soundOff")) + "</button>"
        + "</div><button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
    }
    if (panel === "lang") {
      const cur = (window.BZ && BZ.lang && BZ.lang()) || "en";
      return "<h1>" + t("language") + "</h1><div class=\"opt-menu\">"
        + "<button type=\"button\" class=\"cta opt-item" + (cur === "en" ? " on" : "") + "\" data-lang=\"en\">English</button>"
        + "<button type=\"button\" class=\"cta opt-item" + (cur === "es" ? " on" : "") + "\" data-lang=\"es\">Español</button>"
        + "</div><button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
    }
    const fromPlay = S.optBack === "play" || S.phase === "paused";
    return "<h1>" + (fromPlay ? t("paused") : t("options")) + "</h1>"
      + "<div class=\"opt-menu\">"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-lang\">" + t("language") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-sound\">" + t("sound") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item" + ((S.have.juke || 0) > 0 ? "" : " dim") + "\" id=\"opt-juke\">" + t("jukebox") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item" + ((S.have.aibud || 0) > 0 ? "" : " dim") + "\" id=\"opt-aibud\">" + t("aiLog") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-help\">" + t("tutorial") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-feed\">" + t("feedback") + "</button>"
      + "</div>"
      + "<button class=\"cta\" id=\"go\">" + (fromPlay ? t("resume") : t("back")) + "</button>";
  }
  function bindPauseUi() {
    const go = $("go");
    if (go) go.onclick = () => {
      S.optPanel = null;
      if (S.optBack === "ready") { S.phase = "ready"; renderOverlay(); }
      else setPhase(S.optBack || "play");
    };
    const helpBack = $("help-back");
    if (helpBack) helpBack.onclick = (e) => { e.stopPropagation(); S.optPanel = null; renderOverlay(); };
    overlay.querySelectorAll("[data-buy]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const kind = btn.getAttribute("data-buy");
        const cost = kind === "cold" ? 1200 : kind === "laser" ? 1800 : 9000;
        if (S.cash < cost) { say("Not enough cash", false); renderOverlay(); return; }
        S.cash -= cost;
        if (kind === "cold") S.cold += 1;
        else if (kind === "laser") {
          S.lasers += 1;
          if (S.laserOn) S.laserT += POWER_S; else applyLaser(true);
          if (S.ranked && S.lasers === S.nextOffer) {
            S.optPanel = null;
            openPerkOffer("laser");
            return;
          }
        } else S.msig += 1;
        A.sfx.coin();
        renderOverlay();
        renderHud();
      };
    });
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
    const optHelp = $("opt-help");
    if (optHelp) optHelp.onclick = (e) => { e.stopPropagation(); S.optPanel = "help"; renderOverlay(); };
    const optFeed = $("opt-feed");
    if (optFeed) optFeed.onclick = (e) => { e.stopPropagation(); S.optPanel = "feed"; renderOverlay(); };
    const feedSend = $("feed-send");
    if (feedSend) feedSend.onclick = async (e) => {
      e.stopPropagation();
      const text = (($("feed-text") && $("feed-text").value) || "").trim();
      if (text.length < 8) {
        if ($("feed-msg")) $("feed-msg").textContent = "8+";
        return;
      }
      const ok = window.sendFeedback ? await window.sendFeedback(text) : false;
      if ($("feed-msg")) $("feed-msg").textContent = ok ? t("thanks") : "…";
      if (ok && $("feed-text")) $("feed-text").value = "";
    };
    const optLang = $("opt-lang");
    if (optLang) optLang.onclick = (e) => { e.stopPropagation(); S.optPanel = "lang"; renderOverlay(); };
    const optSound = $("opt-sound");
    if (optSound) optSound.onclick = (e) => { e.stopPropagation(); S.optPanel = "sound"; renderOverlay(); };
    const optAi = $("opt-aibud");
    if (optAi) optAi.onclick = (e) => { e.stopPropagation(); S.optPanel = "aibud"; renderOverlay(); };
    const mt = $("mute-theme");
    if (mt) mt.onclick = (e) => { e.stopPropagation(); A.setMuteTheme(!A.muteTheme()); renderOverlay(); };
    const ms = $("mute-sfx");
    if (ms) ms.onclick = (e) => { e.stopPropagation(); A.setMuteSfx(!A.muteSfx()); renderOverlay(); };
    const mv = $("mute-voice");
    if (mv) mv.onclick = (e) => { e.stopPropagation(); A.setMuteVoice(!A.muteVoice()); renderOverlay(); };
  }

  function showOverlay() {
    overlay.classList.remove("hide");
    overlay.classList.add("open");
    overlay.style.setProperty("display", "flex", "important");
    overlay.style.setProperty("pointer-events", "auto", "important");
  }
  function hideOverlay() {
    overlay.classList.add("hide");
    overlay.classList.remove("open");
    overlay.style.setProperty("display", "none", "important");
    overlay.style.pointerEvents = "none";
    overlay.innerHTML = "";
  }

  function renderOverlay() {
    const p = S.phase;
    if (p === "play") { hideOverlay(); return; }
    showOverlay();
    overlay.classList.toggle("dock", p === "perk" || p === "paused" || p === "chance");
    if (p === "ready") {
      if (S.optPanel) {
        overlay.innerHTML = pauseMarkup();
        bindPauseUi();
      } else {
        overlay.innerHTML = "<h1>Choppy Bitcoin</h1>"
          + "<button class=\"cta\" id=\"go\">" + t("play") + "</button>"
          + "<p class=\"k\">" + t("playSub") + "</p>"
          + "<button type=\"button\" class=\"cta play-alt\" id=\"go-train\">" + t("trainCamp") + "</button>"
          + "<p class=\"k\">" + t("trainNote") + "</p>"
          + (window.choppySignedIn ? "" : "<button type=\"button\" class=\"cta play-alt\" id=\"overlay-auth\">" + t("signIn") + "</button>")
          + tutorialBody()
          + awardListHtml(loadAwards(), "full")
          + "<h3 class=\"k\">" + t("board") + "</h3><pre id=\"ready-board\" class=\"board\">—</pre>";
        $("go").onclick = () => startGame(true);
        $("go").onpointerdown = (e) => { e.stopPropagation(); startGame(true); };
        if ($("go-train")) {
          $("go-train").onclick = () => startGame(false);
          $("go-train").onpointerdown = (e) => { e.stopPropagation(); startGame(false); };
        }
        const oa = $("overlay-auth");
        if (oa) oa.onclick = (e) => { e.stopPropagation(); if (window.openAuth) window.openAuth(); };
        if (window.refreshLeaderboard) window.refreshLeaderboard("ready-board");
      }
    } else if (p === "count") {
      overlay.innerHTML = "<p class=\"count\">" + S.countN + "</p>";
    } else if (p === "chance") {
      const card = S.chanceCard;
      if (!card) { setPhase("play"); return; }
      const es = chanceLang();
      const title = es ? (card.titleEs || card.title) : card.title;
      const body = es ? (card.bodyEs || card.body) : card.body;
      const art = "chance/" + card.id + ".jpg";
      const pic = "<img class=\"chance-art\" src=\"" + art + "\" alt=\"\" onerror=\"this.src='chance/hero.jpg'\">";
      let btns = "";
      if (S.chanceNote) {
        btns = "<button class=\"cta\" data-ch=\"ok\">" + t("chanceAck") + "</button>";
        overlay.innerHTML = "<h1>" + t("chanceHead") + "</h1>" + pic + "<p class=\"k\">" + title + "</p><p>" + S.chanceNote + "</p><div class=\"perk-list\">" + btns + "</div>";
      } else {
        btns = (card.opts || []).map((o) => {
          const lab = es ? (o.labelEs || o.label) : o.label;
          return "<button class=\"cta\" data-ch=\"" + o.k + "\">" + lab + "</button>";
        }).join("");
        overlay.innerHTML = "<h1>" + t("chanceHead") + "</h1>" + pic + "<p class=\"k\">" + title + "</p><p>" + body + "</p><div class=\"perk-list\">" + btns + "</div>";
      }
      overlay.querySelectorAll("[data-ch]").forEach((btn) => {
        const go = (e) => { e.preventDefault(); e.stopPropagation(); pickChance(btn.getAttribute("data-ch")); };
        btn.onpointerdown = go;
        btn.onclick = go;
      });
    } else if (p === "perk") {
      if (!S.perkOffers || !S.perkOffers.length) { setPhase("play"); return; }
      const chosen = S.perkPick;
      const btns = S.perkOffers.map((id) => {
        const tier = (S.have[id] || 0) + 1;
        const sel = chosen === id;
        const label = id === "skip"
          ? t("declinePerk") + " · " + t("declinePerkSub")
          : perkTitle(id, tier) + " · " + perkBlurb(id, tier);
        return "<button class=\"cta" + (id === "skip" ? " play-alt" : "") + (sel ? " on" : "") + "\" data-perk=\"" + id + "\">" + (sel ? "✓ " : "") + label + "</button>";
      }).join("");
      overlay.innerHTML = "<h1>" + t("grabPerk") + "</h1><p>" + (chosen ? t("selected") : t("pickOne")) + (S.perkHint ? "</p><p class=\"k\">A.I. bud: " + perkTitle(S.perkHint, S.poolTier[S.perkHint] || 1) + " — " + perkWhy(S.perkHint) : "") + "</p><div class=\"perk-list\">" + btns + "</div>";
      overlay.querySelectorAll("[data-perk]").forEach((btn) => {
        const go = (e) => { e.preventDefault(); e.stopPropagation(); pickPerk(btn.getAttribute("data-perk")); };
        btn.onpointerdown = go;
        btn.onclick = go;
      });
    } else if (p === "paused") {
      overlay.innerHTML = pauseMarkup();
      bindPauseUi();
    } else if (p === "over") {
      try {
        const ids = runAwardIds(collectRunStats());
        mergeAwards(ids);
      } catch (e) {}
      overlay.innerHTML = "<p class=\"k\">" + t("rekt") + (S.ranked ? "" : " · " + t("trainCamp")) + "</p><h1>" + fmtBtc(netBtc()) + "</h1><p>" + money(S.cash) + " + " + fmtBtc(S.btc) + " @ " + money(S.price) + "</p><p class=\"k\">" + (S.ranked ? t("best") + " " + fmtBtc((S.best || 0) / 1e4) : t("trainNote")) + "</p><div class=\"overlay-actions\"><button class=\"cta\" id=\"go\">" + t("tryAgain") + "</button><button type=\"button\" class=\"cta play-alt\" id=\"share-run\">" + t("share") + "</button></div>";
      if ($("go")) {
        $("go").onclick = replay;
        $("go").onpointerdown = (e) => { e.stopPropagation(); replay(); };
      }
      if ($("share-run")) $("share-run").onclick = () => shareRun("over");
    } else if (p === "win" && S.stats) {
      const st = S.stats;
      mergeAwards(runAwardIds(st));
      const awards = runAwards(st);
      overlay.innerHTML = "<p class=\"k\">TWENTY ONE MILLION</p><h1>The float is yours</h1>"
        + "<p>You stacked the cap. Here is the tape of the run.</p><ul>"
        + "<li><span class=\"k\">Time</span><span>" + fmtTime(st.time) + "</span></li>"
        + "<li><span class=\"k\">Start cash</span><span>" + money(st.startCash) + "</span></li>"
        + "<li><span class=\"k\">Start BTC px</span><span>" + money(st.startPrice) + "</span></li>"
        + "<li><span class=\"k\">End BTC px</span><span>" + money(st.endPrice) + "</span></li>"
        + "<li><span class=\"k\">Peak net</span><span>" + fmtBtc(st.peakNet) + "</span></li>"
        + "<li><span class=\"k\">Net worth</span><span>" + fmtBtc(st.net) + "</span></li>"
        + "<li><span class=\"k\">BTC held</span><span>" + fmtBtc(st.endBtc) + "</span></li>"
        + "<li><span class=\"k\">Candles</span><span>" + st.candles + "</span></li>"
        + "<li><span class=\"k\">Buys / sells</span><span>" + st.buys + " / " + st.sells + "</span></li>"
        + "<li><span class=\"k\">Halvings</span><span>" + (st.halvings || 0) + " caught · " + (st.halveMiss || 0) + " missed</span></li>"
        + "<li><span class=\"k\">Swans vaporized</span><span>" + st.swans + "</span></li></ul>"
        + "<div class=\"awards\"><p class=\"k\">Awards</p>"
        + (awards.length ? awards.map((a) => "<p><span class=\"ia-act\">" + a.name + "</span> — " + a.why + "</p>").join("") : "<p>No extra medals. The cap is the medal.</p>")
        + "</div>"
        + "<div class=\"overlay-actions\"><button class=\"cta\" id=\"go\">Play again</button><button type=\"button\" class=\"cta play-alt\" id=\"share-run\">Share</button><a href=\"/\" class=\"home\" aria-label=\"Back to menu\" title=\"Menu\">⌂</a></div>";
      $("go").onclick = replay;
      if ($("share-run")) $("share-run").onclick = () => shareRun("win");
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
    if (flapBlocked(e)) return;
    e.preventDefault();
    if (A && A.unlock) try { A.unlock(); } catch (err) {}
    S.humanInput = true;
    if (S.phase === "play") flap();
  });
  const flapLayer = $("flap-layer");
  function bindFlap(el) {
    if (!el) return;
    const go = (e) => {
      if (S.phase !== "play") return;
      if (flapBlocked(e)) return;
      e.preventDefault();
      e.stopPropagation();
      S.humanInput = true;
      if (A && A.unlock) try { A.unlock(); } catch (err) {}
      flap();
    };
    el.addEventListener("pointerdown", go);
    el.addEventListener("touchstart", go, { passive: false });
    el.addEventListener("mousedown", go);
  }
  bindFlap(flapLayer);
  bindFlap(canvas);
  overlay.addEventListener("click", (e) => {
    const go = e.target.closest("#go");
    if (!go) return;
    e.preventDefault();
    e.stopPropagation();
    if (S.phase === "ready") startGame();
    else if (S.phase === "over" || S.phase === "win") replay();
    else if (S.phase === "paused" || S.optPanel) {
      S.optPanel = null;
      setPhase(S.optBack === "play" || S.phase === "paused" ? (S.optBack || "play") : "ready");
    }
  });
  window.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName ? e.target.tagName : "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || tag === "select" || (e.target && e.target.isContentEditable);
    if (typing) return;
    if (document.querySelector(".modal.open, .modal.show, #modal-auth.open, #auth-modal.open")) return;
    const k = e.key.toLowerCase();
    if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); if (!e.repeat) flap(); }
    else if (k === "b") { e.preventDefault(); if (!aiLocks().trade) buyBtc(); }
    else if (k === "s") { e.preventDefault(); if (!aiLocks().trade) sellBtc(); }
    else if (k === "p") { e.preventDefault(); togglePause(); }
  });
  $("pause-btn").onpointerdown = (e) => { e.stopPropagation(); e.preventDefault(); togglePause(); };
  const optBtn = $("opt-btn");
  if (optBtn) optBtn.onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if (S.phase === "play") { S.optBack = "play"; S.optPanel = null; setPhase("paused"); }
    else if (S.phase === "ready") {
      S.optBack = "ready";
      S.optPanel = S.optPanel ? null : "menu";
      renderOverlay();
    }
    else if (S.phase === "paused") { S.optPanel = null; setPhase(S.optBack || "play"); }
  };
  $("dca-btn").onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if (S.have.dca <= 0 || aiLocks().dca) return;
    S.dcaOn = !S.dcaOn;
    if (S.aibudLit) S.aibudLit.dca = false;
    renderHud();
  };
  const iaBtn = $("iabud-btn");
  if (iaBtn) iaBtn.onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if ((S.have.aibud || 0) <= 0) return;
    S.aibudOn = !S.aibudOn;
    if (!S.aibudOn) S.aibudLit = {};
    renderHud();
  };
  const trendBtn = $("trend-btn");
  if (trendBtn) trendBtn.onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if (S.have.manip <= 0 || aiLocks().trend) return;
    S.trend = S.trend === "off" ? "up" : S.trend === "up" ? "down" : "off";
    if (S.aibudLit) S.aibudLit.trend = false;
    renderHud();
  };
  const mkt = $("market-btn");
  if (mkt) mkt.onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if ((S.have.market || 0) <= 0) return;
    S.optBack = S.phase === "play" ? "play" : (S.optBack || "ready");
    S.optPanel = "market";
    if (S.phase === "play") setPhase("paused");
    else renderOverlay();
  };
  $("buy-btc").onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if (aiLocks().trade) return;
    if (S.aibudLit) S.aibudLit.buy = false;
    buyBtc();
  };
  $("sell-btc").onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if (aiLocks().trade) return;
    if (S.aibudLit) S.aibudLit.sell = false;
    sellBtc();
  };
  document.querySelectorAll(".spd").forEach((btn) => {
    btn.onpointerdown = (e) => {
      e.stopPropagation(); e.preventDefault();
      if (S.have.ff <= 0) return;
      S.speedMul = S.speedMul === 1 ? ffMax() : 1;
      renderHud();
    };
  });

  window.addEventListener("bz-lang", () => {
    if (window.BZ) BZ.apply(document);
    if (A && A.setLang && window.BZ && BZ.lang) A.setLang(BZ.lang());
    renderOverlay();
    renderHud();
  });
  window.startChoppy = startGame;
  window.replayChoppy = replay;
  window.refreshChoppyAuth = () => {
    if (S.phase === "ready" && !S.optPanel) renderOverlay();
  };
  window.addEventListener("resize", layoutStage);
  window.addEventListener("orientationchange", layoutStage);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", layoutStage);
  try {
    resetWorld(false);
    fillJukebox();
    renderOverlay();
    renderHud();
    layoutStage();
    requestAnimationFrame(loop);
  } catch (e) {
    try { console.error(e); } catch (err) {}
    try { renderOverlay(); } catch (err) {}
  }
})();
