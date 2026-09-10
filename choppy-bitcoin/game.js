(() => {
  const canvas = document.getElementById("c");
  const field = document.getElementById("field");
  const overlay = document.getElementById("overlay");
  const A = window.ArcadeAudio;
  const POWER_S = 5;
  const WAVE_UP = 3;
  const WAVE_BACK = 2;
  const HALVE_N = 21;
  const HALVE_GAP = 210;
  const GREEN = "#4f9d6e";
  const RED = "#c45c4a";
  const BTC = "#c8960a";
  const PX_MIN = 1;
  function clampPx(v) {
    const n = Number(v);
    if (!isFinite(n) || n < PX_MIN) return PX_MIN;
    return n;
  }
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
  const T_UI = {
    aiOn: "A.I. BUD ON", aiOff: "A.I. BUD OFF",
    dcaOn: "DCA ON", dcaOff: "DCA OFF",
    trendUp: "TREND ↑", trendDown: "TREND ↓", trendOff: "TREND OFF",
    buyBtc: "BUY BTC", sellBtc: "SELL BTC",
    options: "OPTIONS", paused: "PAUSED", resume: "RESUME", back: "BACK",
    sound: "SOUND", jukebox: "JUKEBOX", tutorial: "TUTORIAL", feedback: "FEEDBACK",
    language: "LANGUAGE", aiLog: "A.I. BUD LOG", signIn: "SIGN IN",
    ranked: "RANKED", training: "TRAINING",
    soundOn: "ON", soundOff: "OFF",
    bullSongs: "BULL/BEAR SONGS", gameFx: "GAME FX", voices: "VOICES",
    howPlay: "HOW TO PLAY", market: "MARKETPLACE"
  };
  function t(k) {
    if (window.BZ && typeof BZ.t === "function") {
      const v = BZ.t(k);
      if (v != null && v !== k) return v;
    }
    return T_UI[k] || k;
  }

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
  const PERK_NAME = { dca: "DCA", ff: "FastForward", adopt: "Adoption", manip: "Manipulation", candy: "Candle candy", juke: "Jukebox", aibud: "A.I. bud", job: "Employment", market: "Marketplace", chance: "Arc" };
  const PERK_NAME_ES = { dca: "DCA", ff: "FastForward", adopt: "Adopción", manip: "Manipulación", candy: "Caramelo de vela", juke: "Jukebox", aibud: "A.I. bud", job: "Empleo", market: "Mercado", chance: "Arco" };
  const PERK_MAX = { dca: 1, ff: 3, adopt: 7, manip: 7, candy: 10, juke: 5, aibud: 6, job: 7, market: 1, chance: 7 };
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
      if (id === "ff") return es
        ? "añade " + (FF_SPEEDS[tier - 1] || 1.5) + "x a la rotación"
        : "adds " + (FF_SPEEDS[tier - 1] || 1.5) + "x to the speed rotation";
      if (id === "adopt") {
        const bear = adoptBearLabel(tier);
        const bull = adoptBullLabel(tier);
        return es ? "bulls +" + bull + ", bears " + bear : "bulls +" + bull + ", bears " + bear;
      }
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
        if (tier <= 1) return es ? "1 carta Arc cada 21 velas" : "1 Arc card every 21 candles";
        if (tier === 2) return es ? "2 cartas Arc cada 21 velas" : "2 Arc cards every 21 candles";
        return es ? "2 cartas Arc + chance de 3ra" : "2 Arc cards + odds of a 3rd";
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
    return Math.min(1, Math.max(0, Number(tier) || 0) / 7);
  }
  function adoptBearRange(tier) {
    const soft = adoptSoft(tier);
    const lo = -0.09 * (1 - soft * 0.75);
    let hi = -0.045 * (1 - soft * 0.80);
    if (hi >= -0.007) hi = -0.007;
    if (lo >= hi) return { lo: hi - 0.011, hi };
    return { lo, hi };
  }
  function adoptBullRange(tier) {
    const soft = adoptSoft(tier);
    return { lo: 0.05 * (1 - soft * 0.80), hi: 0.10 * (1 - soft * 0.75) };
  }
  function adoptSwanRange(tier) {
    const soft = adoptSoft(tier);
    return { lo: -0.375 * (1 - soft * 0.50), hi: -0.1875 * (1 - soft * 0.50) };
  }
  function adoptBearLabel(tier) {
    const r = adoptBearRange(tier);
    return Math.round(r.lo * 100) + "/" + Math.round(r.hi * 100) + "%";
  }
  function adoptBullLabel(tier) {
    const r = adoptBullRange(tier);
    return Math.round(r.lo * 100) + "/" + Math.round(r.hi * 100) + "%";
  }
  function pickCycleAmp(kind) {
    const t = S.have.adopt || 0;
    const soft = adoptSoft(t);
    let amp;
    if (kind === "HALVE") amp = 1 + (Math.random() * 0.2 - 0.1);
    else if (kind === "SWAN") amp = (0.75 + (Math.random() * 0.2 - 0.1)) * (1 - soft * 0.4) * 0.75;
    else if (kind === "BEAR") amp = (0.17 + Math.random() * 0.05) * (1 - soft * 0.45) * 0.9;
    else amp = (0.17 + Math.random() * 0.05) * (1 - soft * 0.45);
    return amp;
  }

  function pickCycleResid(kind, amp) {
    let mag;
    if (kind === "HALVE") mag = 0.50 + Math.random() * 0.25;
    else if (kind === "SWAN") {
      const r = adoptSwanRange(S.have.adopt || 0);
      mag = Math.abs(r.lo + Math.random() * (r.hi - r.lo));
    } else if (kind === "BULL") {
      const r = adoptBullRange(S.have.adopt || 0);
      mag = r.lo + Math.random() * (r.hi - r.lo);
    } else {
      const r = adoptBearRange(S.have.adopt || 0);
      mag = Math.abs(r.lo + Math.random() * (r.hi - r.lo));
    }
    mag = Math.max(0.004, mag);
    if (mag > amp * 0.92) mag = amp * 0.72;
    return mag;
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
    tape: [], tapeVt: [], tapeMarks: [], eventPeaks: [], eventBottoms: [], waves: [], priceBase: 20000, level: 1,
    startCash: 0, startPrice: 0, peakNet: 0, candles: 0, shownCandles: 0, buys: 0, sells: 0, swans: 0, lasers: 0,
    halvings: 0, halveLeft: HALVE_GAP, halveBull: false, halveFloor: 0, spawnedPipes: 0, halveSide: "up",
    swanBear: false, halveSpeechUntil: 0,
    stats: null, welcomed: false, introCounted: false, speechUntil: 0, humanInput: false, ranked: true,
    jobTrack: null, jobOffer: null, jobName: "",
    have: { dca: 0, ff: 0, adopt: 0, manip: 0, candy: 0, juke: 0, aibud: 0, job: 0, market: 0, chance: 0 },
    poolTier: { dca: 1, ff: 1, adopt: 1, manip: 1, candy: 1, juke: 1, aibud: 1, job: 1, market: 1, chance: 1 },
    offerSeq: [1, 2], nextOffer: 1, offersDone: 0, perkResume: null, perkFib: 0,
    optPanel: null, optBack: "ready",
    sellsBear: 0, coldLost: 0, boughtBtc: false, halveMiss: 0,
    jukeList: [], jukeUnlock: [], jukeTrack: 0, jukeOn: false, jukeShuffle: false, jukeRepeat: "off", jukeOff: {},
    aibudOn: false, aibudLit: {}, iaLog: [], iaProfit: 0, aibudSpeechUntil: 0, aiAcc: 0,
  };

  function netUsd() { return S.cash + S.btc * S.price + S.vt * S.vtPrice; }
  function netBtc() {
    const px = clampPx(S.price);
    return S.btc + S.cash / px + (S.vt * (S.vtPrice || 0)) / px;
  }
  function net() { return netBtc(); }
  function scoreSats() { return Math.max(0, Math.round(netBtc() * 1e4)); }

  function ffSpeeds() {
    const out = [1];
    const n = Math.max(0, Math.min(FF_SPEEDS.length, S.have.ff || 0));
    for (let i = 0; i < n; i++) out.push(FF_SPEEDS[i]);
    return out;
  }
  function ffMax() {
    const list = ffSpeeds();
    return list[list.length - 1] || 1;
  }
  function cycleSpeed() {
    const list = ffSpeeds();
    if (list.length <= 1) { S.speedMul = 1; return; }
    const cur = S.speedMul || 1;
    let i = list.findIndex((x) => Math.abs(x - cur) < 0.001);
    S.speedMul = list[(i < 0 ? 0 : i + 1) % list.length];
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
    if (S.dcaOn && S.have.dca > 0 && clampPx(S.price) > 0) {
      const got = n / clampPx(S.price);
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
      size: gain || power ? 7.35 * 1.05 : 13,
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
      S.peakNet = netBtc(); S.candles = 0; S.shownCandles = 0; S.buys = 0; S.sells = 0; S.swans = 0; S.lasers = 0;
      S.halvings = 0; S.lasers = 0; S.perkPick = ""; S.perkHint = ""; S.dcaOn = false; S.trend = "off"; S.perkOffers = []; S.speedMul = 1;
      S.have = { dca: 0, ff: 0, adopt: 0, manip: 0, candy: 0, juke: 0, aibud: 0, job: 0, market: 0, chance: 0 };
      S.poolTier = { dca: 1, ff: 1, adopt: 1, manip: 1, candy: 1, juke: 1, aibud: 1, job: 1, market: 1, chance: 1 };
      S.offerSeq = S.ranked ? fibSeq(16) : [10, 20, 30];
      S.nextOffer = S.ranked ? 1 : 10;
      S.offersDone = 0;
      S.perkResume = null; S.perkFib = 0;
      S.jukeList = []; S.jukeUnlock = []; S.jukeTrack = 0; S.jukeOn = false; S.jukeShuffle = false; S.jukeRepeat = "off"; S.jukeOff = {};
      S.aibudOn = false; S.aibudLit = {}; S.iaLog = []; S.iaProfit = 0; S.aibudSpeechUntil = 0; S.aiAcc = 0; S.aiTimingStart = null; S.aiTimingLast = 0; S.aiTradeAt = -999;
      S.jobName = ""; S.jobTrack = null; S.jobOffer = null; S.chanceAt = []; S.chanceUntil = 0; S.chanceUsed = {}; S.chanceCard = null; S.chanceNote = ""; S.chanceSettled = false; S.chanceMet = {}; S.chanceLead = "";
      if (A && A.jukeStop) A.jukeStop();
    }
    S.halveLeft = HALVE_GAP; S.halveBull = false; S.halveFloor = 0; S.spawnedPipes = 0; S.halveSide = "up";
    S.shownCandles = 0;
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
    S.cycleMax = S.price; S.cycleMin = S.price; S.cycleMaxI = 0; S.cycleMinI = 0;
    S.lifeT = 0; S.sampleAcc = 0; S.tape = []; S.tapeVt = []; S.tapeLo = null; S.tapeHi = null;
    S.tapeMarks = []; S.eventPeaks = []; S.eventBottoms = []; S.tapeLive = null;
    S.cycleEnv = 0; S.cycleManip = 1; S.cycleStacks = 0;
    S.waves = []; S.priceBase = clampPx(S.price);
    S.speechUntil = 0;
    const first = S.bird.x + 210;
    spawnPipe(first); spawnPipe(first + m.spacing); spawnPipe(first + m.spacing * 2);
    S.spawnX = first + m.spacing * 2;
  }

  function waveK(w, now) {
    const t = now - w.t0;
    if (t <= 0) return 0;
    const dur = WAVE_UP + WAVE_BACK;
    const dir = w.dir;
    if (t <= WAVE_UP) {
      const u = t / WAVE_UP;
      const e = u * u * (3 - 2 * u);
      return dir * w.amp * e;
    }
    if (t < dur) {
      const u = (t - WAVE_UP) / WAVE_BACK;
      const e = u * u * (3 - 2 * u);
      return dir * (w.amp + (w.resid - w.amp) * e);
    }
    return dir * w.resid;
  }

  function syncWaveFlags() {
    const waves = S.waves || [];
    S.halveBull = waves.some((w) => w.kind === "HALVE");
    S.swanBear = waves.some((w) => w.kind === "SWAN");
    S.cycleStacks = waves.length;
    const dur = WAVE_UP + WAVE_BACK;
    let left = 0;
    for (const w of waves) left = Math.max(left, w.t0 + dur - S.lifeT);
    S.powerT = Math.max(0, left);
    if (!waves.length) { S.power = "NONE"; S.powerT = 0; }
  }

  function cutWaves() {
    if (!(S.waves && S.waves.length)) return;
    stampCycleMark();
    S.priceBase = clampPx(S.price);
    S.waves = [];
    S.tapeLive = null;
    S.halveBull = false;
    S.swanBear = false;
    S.power = "NONE";
    S.powerT = 0;
    S.cycleManip = 1;
    S.cycleStacks = 0;
  }

  function beginCycle(type, kind) {
    const k = kind || type;
    const dir = type === "BULL" ? 1 : -1;
    if ((S.waves || []).length && S.power && S.power !== type) cutWaves();
    const amp = pickCycleAmp(k);
    const resid = pickCycleResid(k, amp);
    if (!(S.waves && S.waves.length)) {
      S.priceBase = clampPx(S.price);
      S.cycleStart = S.priceBase;
      S.vtCycle = S.vtPrice;
      S.cycleManip = 1;
      S.cycleMax = S.price;
      S.cycleMin = S.price;
      S.cycleMaxI = S.tape.length;
      S.cycleMinI = S.tape.length;
      S.tapeLive = { kind: dir > 0 ? "peak" : "bottom", price: S.price, i: S.tape.length };
      S.waves = [];
    }
    S.waves.push({ type: type, kind: k, dir: dir, amp: amp, resid: resid, t0: S.lifeT });
    S.power = type;
    if (k === "HALVE") S.halveBull = true;
    if (k === "SWAN") S.swanBear = true;
    syncWaveFlags();
    kickTheme();
  }

  function endCycle() {
    if (S.power === "NONE" && !(S.waves && S.waves.length)) return;
    stampCycleMark();
    let sum = 0;
    for (const w of (S.waves || [])) sum += w.dir * w.resid;
    let next = (S.priceBase || S.price) * (1 + sum) * (S.cycleManip || 1);
    if (S.halveFloor > 0 && S.power === "BULL") next = Math.max(next, S.halveFloor);
    S.price = clampPx(next);
    S.priceBase = S.price;
    if (S.level >= 2 && S.vtCycle > 0) S.vtPrice = Math.max(1, S.vtCycle * (1 + sum * 0.45) * (S.cycleManip || 1));
    S.waves = [];
    S.power = "NONE"; S.powerT = 0; S.halveBull = false; S.swanBear = false;
    S.cycleStacks = 0; S.cycleManip = 1; S.cycleEnv = 0; S.tapeLive = null;
  }

  function halveMinRise() {
    return 15000 * Math.max(1, S.halvings);
  }

  function stampCycleMark() {
    if (S.power === "NONE") return;
    if (!S.tapeMarks) S.tapeMarks = [];
    if (S.power === "BULL") {
      const p = S.cycleMax != null ? S.cycleMax : S.price;
      S.tapeMarks.push({ kind: "peak", price: p, i: S.cycleMaxI || S.tape.length });
    } else if (S.power === "BEAR") {
      const p = S.cycleMin != null ? S.cycleMin : S.price;
      S.tapeMarks.push({ kind: "bottom", price: p, i: S.cycleMinI || S.tape.length });
    }
    if (S.tapeMarks.length > 36) S.tapeMarks = S.tapeMarks.slice(-36);
  }

  function noteCyclePrice() {
    if (S.power !== "BULL" && S.power !== "BEAR") return;
    const i = S.tape.length;
    if (S.cycleMax == null || S.price >= S.cycleMax) { S.cycleMax = S.price; S.cycleMaxI = i; }
    if (S.cycleMin == null || S.price <= S.cycleMin) { S.cycleMin = S.price; S.cycleMinI = i; }
    const peak = S.power === "BULL";
    S.tapeLive = {
      kind: peak ? "peak" : "bottom",
      price: peak ? S.cycleMax : S.cycleMin,
      i: peak ? S.cycleMaxI : S.cycleMinI
    };
  }

  function trendBias() {
    let bias = 0.0006 * (1 + (Math.random() * 2 - 1) * 0.05);
    if ((S.have.manip || 0) > 0) {
      const k = (S.have.manip || 0) * (12 / 7);
      if (S.trend === "up") bias += 0.004 * k;
      else if (S.trend === "down") bias -= 0.004 * k;
    }
    return bias;
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
      beginCycle("BEAR", "SWAN");
      return;
    }
    if (it.type === "LASER") {
      S.lasers += 1;
      if (S.laserOn) S.laserT += POWER_S; else applyLaser(true);
      const line = drawLine(A.LASER && A.LASER.length ? A.LASER : ["Laser eyes!"], 0.15);
      say(line || "Laser eyes!", true);
      A.sfx.power();
      if (S.ranked) tryRankedPerk(false);
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
      const floorFrom = S.power === "BULL" ? (S.priceBase || S.price) : S.price;
      S.halveFloor = Math.max(S.halveFloor, floorFrom + halveMinRise());
      beginCycle("BULL", "HALVE");
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
    if (S.phase !== "play" || S.cash <= 0 || clampPx(S.price) <= 0) return;
    const usd = S.cash, got = usd / clampPx(S.price);
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
      confirmPerk();
      return;
    }
    if (S.phase === "play") { S.optBack = "play"; setPhase("paused"); }
    else if (S.phase === "paused") setPhase(S.optBack || "play");
  }

  function pickPerk(kind) {
    if (S.perkPick && S.perkPick === kind) {
      confirmPerk();
      return;
    }
    S.perkPick = kind;
    renderOverlay();
    renderHud();
  }

  function confirmPerk() {
    if (S.phase !== "perk" || !S.perkPick) return;
    grantPerk(S.perkPick);
    S.perkPick = "";
    S.perkOffers = [];
    bumpOffer();
    const resume = S.perkResume;
    S.perkResume = null;
    if (resume && resume.phase === "paused") {
      S.optPanel = resume.panel || "market";
      S.optBack = "play";
      setPhase("paused");
      tryRankedPerk(true);
      return;
    }
    setPhase("play");
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
    const job = currentJob();
    const t = Math.max(1, Math.min(7, S.have.job || 1));
    const title = (job && job.titles && job.titles[t - 1]) || "Job";
    say(title + " payday", false);
  }

  function chanceP3(tier) {
    return Math.min(0.72, 0.12 + Math.max(0, tier - 3) * 0.15);
  }

  function planChanceWindow(from) {
    const t = S.have.chance || 0;
    if (t <= 0) { S.chanceAt = []; S.chanceUntil = 0; return; }
    const start = from + 1;
    const end = from + 21;
    const used = {};
    const pick = () => {
      let c, n = 0;
      do { c = start + ((Math.random() * 21) | 0); n++; } while (used[c] && n < 30);
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
    return Math.max(0, (S.cash || 0) + (S.btc || 0) * clampPx(S.price));
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
  function cutBill(usd) {
    const w = wealthUsd();
    if (w <= 0) return 0;
    const pinch = Math.max(usd, w * 0.006);
    return takeWealthPct(Math.min(0.2, pinch / w));
  }
  function chanceLang() {
    return window.BZ && BZ.lang && BZ.lang() === "es";
  }
  const CHANCE_CAST = {
    lena: {
      names: ["Lena"],
      en: ["Lena, the love of your life", "Lena, who still calls you Fartface", "Lena, your person since the cheap-rent years"],
      es: ["Lena, el amor de tu vida", "Lena, la que todavía te dice Fartface", "Lena, tu compañera desde el depto de reja"]
    },
    paco: {
      names: ["Paco"],
      en: ["Paco, your French bulldog", "Paco, who votes by eating the brochure", "Paco, who sits under the leak on purpose"],
      es: ["Paco, tu bulldog francés", "Paco, el que vota comiéndose el folleto", "Paco, el que se sienta bajo la gotera a propósito"]
    },
    marek: {
      names: ["Marek"],
      en: ["Marek, your friend who always has wine on the table", "Marek, who talks like certainty is optional", "Marek, who takes you to machines in the back of bars"],
      es: ["Marek, tu amigo que siempre tiene vino en la mesa", "Marek, el que habla como si la certeza fuera opcional", "Marek, el que te lleva a las máquinas del fondo del bar"]
    },
    nico: {
      names: ["Nico"],
      en: ["Nico, your cousin", "Nico, who always has three things going before lunch", "Nico, family by blood and by group chat"],
      es: ["Nico, tu primo", "Nico, el que siempre tiene tres cosas antes del mediodía", "Nico, familia de sangre y de grupo"]
    },
    sofi: {
      names: ["Sofi"],
      en: ["Sofi, your niece", "Sofi, Nico's kid who sends photos you cannot parse", "Sofi, the niece who treats you like an uncle"],
      es: ["Sofi, tu sobrina", "Sofi, la nena de Nico que manda fotos que no entendés", "Sofi, la sobrina que te trata de tío"]
    },
    hector: {
      names: ["Uncle Héctor", "Uncle Hector", "tío Héctor", "Tío Héctor", "El tío Héctor", "el tío Héctor"],
      en: ["Uncle Héctor, your mother's brother", "Uncle Héctor, who wires money with no explanation", "Uncle Héctor, family from your mother's side"],
      es: ["El tío Héctor, el hermano de tu vieja", "El tío Héctor, el que gira plata sin explicar", "El tío Héctor, familia del lado de tu mamá"]
    },
    mike: {
      names: ["Uncle Mike", "tío Mike", "Tío Mike"],
      en: ["Uncle Mike, who treats a tip line like a debate stage", "Uncle Mike, in town for one dinner", "Uncle Mike, family who studies the check first"],
      es: ["El tío Mike, el que trata la propina como un debate", "El tío Mike, de paso por una cena", "El tío Mike, familia que mira la cuenta primero"]
    }
  };
  const CHANCE_WHO = {
    landfill: ["nico", "lena"], taxbill: [], nicoWedding: ["nico", "lena", "paco"], mexico: ["lena", "paco"],
    flu: ["lena", "paco"], phish: [], crash: [], casino: ["nico"], poker: ["marek"],
    uncle: ["hector"], school: ["sofi", "lena"], roof: ["paco"], lotto: ["marek"],
    hospital: ["lena"], startup: ["nico"], tow: [], courage: ["marek", "lena"],
    ring: ["lena"], date: ["lena"], proposal: ["lena"], wedding: ["lena", "nico", "paco"],
    honeymoon: ["lena", "paco"], pregnancy: ["lena"], baby: ["lena", "paco"], cousin: ["nico"],
    speeding: [], wallet: [], potluck: ["lena", "paco"], usedcar: ["nico"], tetris: ["marek"],
    unclemike: ["mike"]
  };
  function weaveCast(text) {
    return text;
  }
  const CHANCE_CARDS = [
    { id: "landfill", kind: "choice",
      title: "The Landfill", titleEs: "The Landfill",
      body: "At 1:14 AM, your cousin Nico sends a voice message.\n\nA dark photo. A truck. A shovel leaning against the hood.\n\n“I'm in Wales. I got permission to dig Docksway.”\n\nIn 2009, a USB drive containing 8,000 BTC was supposedly lost there.\n\n“I need a partner, Choppy” he writes. “Not a spectator.”\n\nFrom the other side of the bed, Lena opens one eye.\n\n—If you invest in a gross treasure hunt at 1 A.M., I'm calling you Fartface next time you're about to come.\n\nYou look at the photo again.\n\nThe shovel does look surprisingly convincing.",
      bodyEs: "At 1:14 AM, your cousin Nico sends a voice message.\n\nA dark photo. A truck. A shovel leaning against the hood.\n\n“I'm in Wales. I got permission to dig Docksway.”\n\nIn 2009, a USB drive containing 8,000 BTC was supposedly lost there.\n\n“I need a partner, Choppy” he writes. “Not a spectator.”\n\nFrom the other side of the bed, Lena opens one eye.\n\n—If you invest in a gross treasure hunt at 1 A.M., I'm calling you Fartface next time you're about to come.\n\nYou look at the photo again.\n\nThe shovel does look surprisingly convincing.",
      opts: [
        { k: "a", label: "Put in 25% of net worth", labelEs: "Put in 25% of net worth" },
        { k: "b", label: "Put in 75% of net worth", labelEs: "Put in 75% of net worth" }
      ] },
    { id: "taxbill", kind: "report",
      title: "Quarterly Tax Bill", titleEs: "La boleta trimestral",
      body: "Your quarterly tax bill arrives. You open it, stare at it, close it, then open it again as if the number might have changed. It has not.",
      bodyEs: "Llega la boleta trimestral. La abrís, la mirás, la cerrás y la volvés a abrir por si el número cambió. No cambió." },
    { id: "nicoWedding", kind: "choice", after: ["landfill"],
      title: "Nico Gets Married", titleEs: "Se casa Nico",
      body: "Nico is getting married. He has always had too much energy and at least three things going on at once. You arrive with Lena and Paco, who has already decided he dislikes the venue. The salon holds 400 people. You recognize maybe twelve. The DJ is playing old CDs from 1998. Nico is near the bar explaining an extremely complicated idea to a stranger who did not ask. Lena looks at you. \"Please don't let your cousin talk you into anything tonight.\" At the envelope table, you have to decide how much to give.",
      bodyEs: "Nico se casa. Siempre tuvo demasiada energía y al menos tres cosas al mismo tiempo. Llegan con Lena y Paco, que ya decidió que el salón no le gusta. Entran 400. Reconocés doce. El DJ pone CDs de 1998. Nico está en la barra explicándole una idea complicada a un desconocido que no preguntó. Lena te mira. \"Esta noche no dejes que tu primo te convenza de nada.\" En la mesa de sobres hay que decidir cuánto dejar.",
      opts: [
        { k: "a", label: "Be generous · 4%", labelEs: "Ser generoso · 4%" },
        { k: "b", label: "Give less · 0.6%", labelEs: "Dar menos · 0.6%" },
        { k: "c", label: "Skip the gift", labelEs: "No dejar sobre" }
      ] },
    { id: "mexico", kind: "choice", after: ["landfill"],
      title: "Mexico", titleEs: "México",
      body: "Lena suggests a few days in the Mexican Riviera. Tulum. Warm water, white sand, small restaurants, and a hotel that looks more expensive in the photos than it probably is. Sounds like a nice place to leave a ColdCard randomness incident behind. You look at the flights together. Paco watches from the floor. Lena wants five days. You think three would be enough. Paco eats one of the travel brochures. You take that as his vote.",
      bodyEs: "Lena propone unos días en la Riviera Mexicana. Tulum. Agua tibia, arena blanca, restoranes chicos y un hotel que en las fotos se ve más caro de lo que probablemente es. Un buen lugar para dejar atrás el incidente de aleatoriedad del ColdCard. Miran los vuelos juntos. Paco observa desde el piso. Lena quiere cinco días. Vos pensás que con tres alcanza. Paco se come uno de los folletos. Lo tomás como su voto.",
      opts: [
        { k: "a", label: "Book the trip · 8%", labelEs: "Reservar · 8%" },
        { k: "b", label: "Stay home", labelEs: "Quedarnos" }
      ] },
    { id: "flu", kind: "report", after: ["landfill"],
      title: "Flu", titleEs: "Gripe",
      body: "Lena gets the flu. You spend the day bringing her water, medicine, soup, and whatever else she asks for. By evening you have spent money you will not get back. Paco eats half the soup. Lena does not notice.",
      bodyEs: "A Lena le da gripe. Pasás el día llevándole agua, remedio, sopa y lo que pida. A la noche ya gastaste plata que no vuelve. Paco se come la mitad de la sopa. Lena no se da cuenta." },
    { id: "phish", kind: "choice",
      title: "Phishing", titleEs: "Phishing",
      body: "You receive an email from customer support. They say there is a problem with your account. They need your seed phrase to verify your identity. The email looks extremely convincing.",
      bodyEs: "Llega un mail de soporte. Dicen que hay un problema con tu cuenta. Necesitan tu seed para verificar la identidad. El mail se ve extremadamente convincente.",
      opts: [
        { k: "a", label: "Open the link", labelEs: "Abrir el enlace" },
        { k: "b", label: "Delete it", labelEs: "Borrarlo" }
      ] },
    { id: "crash", kind: "report",
      title: "Scooter Crash", titleEs: "El scooter",
      body: "A delivery scooter hits your car at a very low speed. Nobody is seriously hurt. The scooter driver apologizes six times. You apologize twice. Nobody knows why you apologized.",
      bodyEs: "Un scooter de delivery pega tu auto a muy baja velocidad. Nadie sale realmente lastimado. El pibe se disculpa seis veces. Vos te disculpás dos. Nadie sabe por qué lo hiciste." },
    { id: "wine", kind: "choice", after: ["landfill"],
      title: "Wine", titleEs: "Wine",
      body: "It's Friday night. You are at Marek's apartment with a bottle of wine, dinner half-finished, and 12 Monkeys paused on the TV.\n\nThis is how you usually spend time together: wine, old movies, and conversations that go much longer than planned.\n\nTo nobody's surprise, you eventually end up debating A.I. and futurism.\n\nYou're usually the more enthusiastic one.\n\nMarek knows more, but trusts human nature less.\n\nNeither of you wins.",
      bodyEs: "It's Friday night. You are at Marek's apartment with a bottle of wine, dinner half-finished, and 12 Monkeys paused on the TV.\n\nThis is how you usually spend time together: wine, old movies, and conversations that go much longer than planned.\n\nTo nobody's surprise, you eventually end up debating A.I. and futurism.\n\nYou're usually the more enthusiastic one.\n\nMarek knows more, but trusts human nature less.\n\nNeither of you wins.",
      opts: [
        { k: "a", label: "Keep talking", labelEs: "Keep talking" },
        { k: "b", label: "Get ice cream", labelEs: "Get ice cream" },
        { k: "c", label: "Cab home", labelEs: "Cab home" }
      ] },
    { id: "casino", kind: "choice", after: ["landfill"],
      title: "Nico Finds a Table", titleEs: "Nico encontró una mesa",
      body: "Nico calls at 11:40 P.M. \"I found a table.\" You ask where. \"A casino.\" You should probably ask more questions. Instead, you go. He has already found a game that he considers interesting.",
      bodyEs: "Nico llama a las 23:40. \"Encontré una mesa.\" Preguntás dónde. \"Un casino.\" Deberías hacer más preguntas. En vez de eso, vas. Ya encontró un juego que considera interesante.",
      opts: [
        { k: "a", label: "Bet 10%", labelEs: "Apostar 10%" },
        { k: "b", label: "Bet 30%", labelEs: "Apostar 30%" },
        { k: "c", label: "Leave", labelEs: "Irte" }
      ] },
    { id: "poker", kind: "choice", after: ["wine", "casino"],
      title: "Poker", titleEs: "Póker",
      body: "Marek invites you to a poker game. Not a casino. Just people he knows, sitting around a table late at night. He is already there when you arrive, drinking wine and watching the game. He looks at your chips. \"You're playing?\" \"I guess.\" He nods. \"Good.\"",
      bodyEs: "Marek te invita a un póker. No es un casino. Gente que él conoce, mesa de madrugada. Ya está cuando llegás, con vino, mirando el juego. Mira tus fichas. \"¿Jugás?\" \"Supongo.\" Asiente. \"Bien.\"",
      opts: [
        { k: "a", label: "Buy in · 8%", labelEs: "Buy-in · 8%" },
        { k: "b", label: "Buy in · 25%", labelEs: "Buy-in · 25%" },
        { k: "c", label: "Stay at the pier", labelEs: "Quedarte en el muelle" }
      ] },
    { id: "uncle", kind: "report",
      title: "Uncle Héctor", titleEs: "El tío Héctor",
      body: "Uncle Héctor sends a message. No explanation. Just: \"Check your account.\" He has transferred you some money. You call him. He refuses to explain why.",
      bodyEs: "El tío Héctor manda un mensaje. Sin explicación. Solo: \"Fijate la cuenta.\" Te giró plata. Lo llamás. Se niega a decir por qué." },
    { id: "school", kind: "choice", after: ["nicoWedding"],
      title: "School Trip", titleEs: "El viaje de estudio",
      body: "Sofi is going on a school trip to the Mint Museum. Her family is a little short this month. Lena thinks you should help. You agree, or you don't.",
      bodyEs: "Sofi se va de viaje de estudio al museo de la Casa de Moneda. En casa este mes están justos. Lena cree que deberías ayudar. Aceptás, o no.",
      opts: [
        { k: "a", label: "Cover the trip", labelEs: "Cubrir el viaje" },
        { k: "b", label: "Let them handle it", labelEs: "Que se arreglen" }
      ] },
    { id: "roof", kind: "report",
      title: "Roof", titleEs: "El techo",
      body: "Paco finds the leak in the roof before you do. He sits directly underneath it. The workers arrive. He moves. He immediately finds another place to sit.",
      bodyEs: "Paco encuentra la gotera antes que vos. Se sienta justo debajo. Llegan los de la obra. Se corre. Enseguida encuentra otro lugar donde sentarse." },
    { id: "lotto", kind: "report", after: ["wine"],
      title: "Lottery Ticket", titleEs: "El raspa y gana",
      body: "You are having wine with Marek. At some point the conversation turns to probability. You buy a lottery ticket. The next morning Marek asks if you checked the numbers. You did not.",
      bodyEs: "Estás tomando vino con Marek. En algún momento la charla vira a probabilidad. Comprás un raspa y gana. A la mañana Marek pregunta si miraste los números. No los miraste." },
    { id: "hospital", kind: "report", after: ["landfill"],
      title: "Four Stitches", titleEs: "Cuatro puntos",
      body: "You need four stitches. Lena drives you to the hospital. She waits with you. On the way home she says: \"Try not to bleed on anything.\"",
      bodyEs: "Necesitás cuatro puntos. Lena te lleva al hospital. Espera con vos. De vuelta a casa dice: \"Tratá de no sangrar sobre nada.\"" },
    { id: "startup", kind: "choice", after: ["landfill"],
      title: "Startup", titleEs: "La startup",
      body: "Nico calls. \"I have a plan.\" You already know this is going somewhere. He has built a 47-slide presentation for an app that combines subscriptions, artificial intelligence, and something he calls community ownership. He says the upside is massive.",
      bodyEs: "Llama Nico. \"Tengo un plan.\" Ya sabés que esto va a algún lado. Armó una presentación de 47 diapositivas para una app que combina suscripciones, inteligencia artificial y algo que llama community ownership. Dice que el upside es enorme.",
      opts: [
        { k: "a", label: "Invest 20%", labelEs: "Invertir 20%" },
        { k: "b", label: "Pass", labelEs: "Paso" }
      ] },
    { id: "tow", kind: "report",
      title: "Nine Minutes", titleEs: "Nueve minutos",
      body: "You parked in the wrong place for nine minutes. You check the sign again. It was very clear.",
      bodyEs: "Estacionaste mal durante nueve minutos. Volvés a mirar el cartel. Estaba muy claro." },
    { id: "courage", kind: "choice", after: ["wine"],
      title: "Courage", titleEs: "Coraje",
      body: "You are at Marek's apartment. There is wine on the table and 12 Monkeys paused on the TV. You end up talking about A.I., futurism, and whether people actually know what they want. Eventually you mention Lena. Marek looks at you. \"So?\" You shrug. \"We've been together for years.\" He takes a sip. \"Maybe you're waiting for certainty.\" Then he presses play again. You keep thinking about it.",
      bodyEs: "Estás en el depto de Marek. Hay vino en la mesa y 12 Monkeys en pausa. Terminan hablando de I.A., futurismo y si la gente sabe lo que quiere. En algún momento nombrás a Lena. Marek te mira. \"¿Y?\" Te encogés de hombros. \"Hace años que estamos.\" Toma un sorbo. \"Capaz estás esperando certeza.\" Vuelve a darle play. Segís pensándolo.",
      opts: [
        { k: "a", label: "Buy the ring · 6%", labelEs: "Comprar el anillo · 6%" },
        { k: "b", label: "Wait", labelEs: "Esperar" }
      ] },
    { id: "ring", kind: "choice", after: ["courage"],
      title: "The Ring", titleEs: "El anillo",
      body: "You go to the jewelry store. You know exactly why you are there. You do not know what size of diamond makes you look responsible without looking ridiculous.",
      bodyEs: "Vas a la joyería. Sabés exactamente por qué estás ahí. No sabés qué tamaño de diamante te hace parecer responsable sin parecer ridículo.",
      opts: [
        { k: "a", label: "Buy the ring · 8%", labelEs: "Comprar el anillo · 8%" },
        { k: "b", label: "Buy the cheaper one · 3%", labelEs: "El más barato · 3%" }
      ] },
    { id: "date", kind: "choice", after: ["ring"],
      title: "Date", titleEs: "La cita",
      body: "You plan a proper date. A nice restaurant. A walk. The lake at sunset. The restaurant is nice. The walk is quiet. The lake looks good at sunset. Nothing goes wrong. This feels suspicious.",
      bodyEs: "Planeás una cita en forma. Un restorán bueno. Una caminata. El lago al atardecer. El restorán está bien. La caminata es silenciosa. El lago se ve bien. No pasa nada malo. Eso se siente sospechoso.",
      opts: [
        { k: "a", label: "Nice restaurant", labelEs: "Restorán bueno" },
        { k: "b", label: "Keep it simple", labelEs: "Dejarlo simple" },
        { k: "c", label: "Cancel", labelEs: "Cancelar" }
      ] },
    { id: "proposal", kind: "choice", after: ["date"],
      title: "Proposal", titleEs: "La propuesta",
      body: "The lake is getting dark. You and Lena are standing by the water. The date went well enough that you are starting to worry. The ring is in your pocket. You take a breath. You tell Lena you love her. You ask her to marry you. She looks at you for a moment. Then she smiles. \"Yes, Fartface.\"",
      bodyEs: "El lago se oscurece. Están parados junto al agua. La cita salió lo bastante bien como para que empieces a preocuparte. El anillo está en el bolsillo. Respirás. Le decís que la querés. Le pedís que se case con vos. Te mira un segundo. Sonríe. \"Sí, Fartface.\"",
      opts: [
        { k: "a", label: "Propose properly · 2%", labelEs: "Proponerlo en forma · 2%" },
        { k: "b", label: "Panic and stand there", labelEs: "Entrar en pánico y quedarte" },
        { k: "c", label: "Make a joke and run · 1%", labelEs: "Hacer un chiste y correr · 1%" }
      ] },
    { id: "wedding", kind: "choice", after: ["proposal"],
      title: "Wedding", titleEs: "La boda",
      body: "You and Lena are getting married. There are invitations, food, relatives, flowers, music, and several decisions you did not realize were decisions. Lena has opinions. You have some opinions. Most of hers win.",
      bodyEs: "Se casan con Lena. Hay invitaciones, comida, parientes, flores, música y varias decisiones que no sabías que eran decisiones. Lena tiene opiniones. Vos tenés algunas. Ganan casi todas las de ella.",
      opts: [
        { k: "a", label: "The wedding Lena wants · 12%", labelEs: "La boda que quiere Lena · 12%" },
        { k: "b", label: "Keep it small · 5%", labelEs: "Hacerla chica · 5%" },
        { k: "c", label: "Run away together · 1%", labelEs: "Fugarse juntos · 1%" }
      ] },
    { id: "honeymoon", kind: "choice", after: ["wedding"],
      title: "Honeymoon", titleEs: "La luna de miel",
      body: "You and Lena finally leave. For several days you agree on one rule: no checking the portfolio. You immediately wonder whether looking at the total counts. Lena takes your phone away. You have three possible itineraries.",
      bodyEs: "Por fin se van. Durante varios días acuerdan una regla: no mirar el portfolio. Enseguida te preguntás si mirar solo el total cuenta. Lena te saca el teléfono. Hay tres itinerarios posibles.",
      opts: [
        { k: "a", label: "Japan · 10%", labelEs: "Japón · 10%" },
        { k: "b", label: "Italy · 6%", labelEs: "Italia · 6%" },
        { k: "c", label: "Patagonia · 4%", labelEs: "Patagonia · 4%" }
      ] },
    { id: "pregnancy", kind: "report", after: ["honeymoon"],
      title: "Being Four", titleEs: "Being Four",
      body: "Two lines on a test change everything.\n\nYou and Lena are going to have a baby.\n\nFor a few seconds, neither of you says anything.\n\nPaco yawns.\n\nYou look at him.\n\n‘Four,’ you say.\n\nLena smiles.\n\nThere will be doctors, appointments, preparations, and a lot of things to pay for. The first costs come to $450.\n\nYou sleep surprisingly well that night.",
      bodyEs: "Two lines on a test change everything.\n\nYou and Lena are going to have a baby.\n\nFor a few seconds, neither of you says anything.\n\nPaco yawns.\n\nYou look at him.\n\n‘Four,’ you say.\n\nLena smiles.\n\nThere will be doctors, appointments, preparations, and a lot of things to pay for. The first costs come to $450.\n\nYou sleep surprisingly well that night." },
    { id: "baby", kind: "choice", after: ["pregnancy"],
      title: "The night must fade and give to light a brand new day",
      titleEs: "The night must fade and give to light a brand new day",
      body: "The baby arrives.\n\nYou are tired.\n\nLena is tired.\n\nPaco is confused.\n\nKids grow fast. You start thinking about what kind of future you want to build.",
      bodyEs: "The baby arrives.\n\nYou are tired.\n\nLena is tired.\n\nPaco is confused.\n\nKids grow fast. You start thinking about what kind of future you want to build.",
      opts: [
        { k: "a", label: "Set things up properly", labelEs: "Set things up properly" },
        { k: "b", label: "Keep it simple", labelEs: "Keep it simple" },
        { k: "c", label: "Send a PDF of financial advice", labelEs: "Send a PDF of financial advice" }
      ] },
    { id: "cousin", kind: "choice", after: ["landfill"],
      title: "Nico's New Thing", titleEs: "La nueva de Nico",
      body: "Nico calls again. \"I found something.\" Of course he did. This time it is a new token. He says it will do ten times by Friday. You ask what it actually does. He says that is not the important part.",
      bodyEs: "Nico llama de nuevo. \"Encontré algo.\" Claro que sí. Esta vez es un token nuevo. Dice que hace x10 para el viernes. Preguntás qué hace. Dice que esa no es la parte importante.",
      opts: [
        { k: "a", label: "Invest 40%", labelEs: "Invertir 40%" },
        { k: "b", label: "Walk away", labelEs: "Salir de ahí" }
      ] },
    { id: "speeding", kind: "report", after: ["tow"],
      title: "Six Miles Per Hour", titleEs: "Diez kilómetros de más",
      body: "You are six miles per hour over the limit. Same corner. Same officer. Same bad decision.",
      bodyEs: "Vas diez kilómetros arriba del límite. La misma esquina. El mismo oficial. La misma mala decisión." },
    { id: "wallet", kind: "report",
      title: "Seat 14", titleEs: "Asiento 14",
      body: "You leave your wallet on bus seat 14. You realize it three stops later. You call the company. Someone found it. The cash is gone. Your cards are still there. You consider this a partial victory.",
      bodyEs: "Dejás la billetera en el asiento 14 del bondi. Te das cuenta tres paradas después. Llamás. Alguien la encontró. El efectivo no está. Las tarjetas sí. Lo considerás una victoria parcial." },
    { id: "potluck", kind: "choice", after: ["landfill"],
      title: "Neighborhood Potluck", titleEs: "La olla de la cuadra",
      body: "Lena signs both of you up for a neighborhood potluck. She also signs Paco up. You explain that Paco cannot cook. She says: \"He can attend.\" Paco eats half of what you brought before you arrive.",
      bodyEs: "Lena los anota a los dos en la olla de la cuadra. También anota a Paco. Explicás que Paco no cocina. Dice: \"Puede asistir.\" Paco se come la mitad de lo que llevaron antes de llegar.",
      opts: [
        { k: "a", label: "Donate generously · 5%", labelEs: "Donar en serio · 5%" },
        { k: "b", label: "Bring nothing", labelEs: "No llevar nada" }
      ] },
    { id: "usedcar", kind: "choice", after: ["landfill"],
      title: "The Used Car", titleEs: "El usado",
      body: "Nico has another opportunity. A 2009 Honda Fit. The seller says it has a new timing belt. Nico looks under the hood. \"It has Sharpie.\" You are not sure what that means. Nico says it means \"basically new.\"",
      bodyEs: "Nico tiene otra oportunidad. Un Honda Fit 2009. El vendedor dice que tiene correa nueva. Nico mira bajo el capó. \"Tiene Sharpie.\" No sabés qué significa. Nico dice que significa \"casi nuevo.\"",
      opts: [
        { k: "a", label: "Buy it · 12%", labelEs: "Comprarlo · 12%" },
        { k: "b", label: "Walk away", labelEs: "Irte" }
      ] },
    { id: "tetris", kind: "choice", after: ["wine"],
      title: "Tetris", titleEs: "Tetris",
      body: "Marek takes you to an old bar with an arcade machine in the back. There is a Tetris cabinet nobody seems to use. He starts playing. He gets unusually focused. \"Trying not to make it worse.\" After a few minutes he steps aside. \"Your turn.\"",
      bodyEs: "Marek te lleva a un bar viejo con una máquina de arcade al fondo. Hay un cabinet de Tetris que nadie usa. Empieza a jugar. Se concentra de un modo raro. \"Trato de no empeorarlo.\" A los minutos se corre. \"Tu turno.\"",
      opts: [
        { k: "a", label: "Put money in", labelEs: "Meterle plata" },
        { k: "b", label: "Watch Marek play", labelEs: "Mirar a Marek" }
      ] },
    { id: "unclemike", kind: "choice",
      title: "Fancy Dinner with Uncle Mike", titleEs: "Fancy Dinner with Uncle Mike",
      body: "Your Uncle Mike is in town.\n\nYou meet him for dinner at a fancy restaurant.\n\nThe food is excellent.\n\nThe wine is excellent.\n\nWhen the check arrives, Uncle Mike studies it.\n\nThen he looks at the tip line.\n\nHe puts the pen down.\n\n“Why am I paying their salary?!”\n\nYou explain that the tip is expected.\n\n“That's the problem.”\n\nHe goes on a long rant about tipping culture, explaining that restaurants should pay their employees properly instead of making customers responsible for their wages.\n\nYou agree.\n\nYou just want to go home.\n\nThe waiter is still standing there.\n\nYou look at the tip line again.",
      bodyEs: "Your Uncle Mike is in town.\n\nYou meet him for dinner at a fancy restaurant.\n\nThe food is excellent.\n\nThe wine is excellent.\n\nWhen the check arrives, Uncle Mike studies it.\n\nThen he looks at the tip line.\n\nHe puts the pen down.\n\n“Why am I paying their salary?!”\n\nYou explain that the tip is expected.\n\n“That's the problem.”\n\nHe goes on a long rant about tipping culture, explaining that restaurants should pay their employees properly instead of making customers responsible for their wages.\n\nYou agree.\n\nYou just want to go home.\n\nThe waiter is still standing there.\n\nYou look at the tip line again.",
      opts: [
        { k: "a", label: "Leave a 20% tip", labelEs: "Leave a 20% tip" },
        { k: "b", label: "Leave no tip", labelEs: "Leave no tip" },
        { k: "c", label: "Leave a small voluntary tip", labelEs: "Leave a small voluntary tip" }
      ] }
  ];
  function resolveChance(card, opt) {
    const es = chanceLang();
    const say = (en, esTxt) => (es ? esTxt : en);
    if (card.id === "landfill") {
      const pct = opt === "b" ? 0.75 : 0.25;
      const cashCut = (S.cash || 0) * pct;
      const btcCut = (S.btc || 0) * pct;
      S.cash -= cashCut;
      S.btc -= btcCut;
      const r = Math.random();
      if (r < 0.00029) {
        const share = opt === "b" ? 4000 : (4000 / 3);
        S.btc += share;
        return say("Find the USB. +" + share.toFixed(2) + " BTC.",
          "Find the USB. +" + share.toFixed(2) + " BTC.");
      }
      if (r < 0.00029 + 0.22) {
        S.cash += 8;
        return say("Find old Nokia. +$8.",
          "Find old Nokia. +$8.");
      }
      return say("Three weeks digging through clay and nothing.",
        "Three weeks digging through clay and nothing.");
    }
    if (card.id === "taxbill") {
      const paid = cutPct(0.1);
      return say("It has not changed. −" + money(paid) + ".", "No cambió. −" + money(paid) + ".");
    }
    if (card.id === "nicoWedding") {
      if (opt === "c") return say("You spend the rest of the night avoiding Nico near the bar.", "El resto de la noche evitás a Nico en la barra.");
      if (opt === "a") {
        const paid = cutPct(0.04);
        S.cold += 1;
        return say("They toast you. −" + money(paid) + ". Nico hands you a cold-storage device. \"Part of the wedding experience.\"",
          "Brindan por vos. −" + money(paid) + ". Nico te pasa un cold storage. \"Parte de la experiencia.\"");
      }
      const paid = cutPct(0.006);
      return say("Nico looks at the envelope, then at you. \"Fair.\" −" + money(paid) + ".",
        "Nico mira el sobre, después a vos. \"Justo.\" −" + money(paid) + ".");
    }
    if (card.id === "mexico") {
      if (opt === "b") return say("You stay home. Paco destroys a cushion.", "Se quedan. Paco destruye un almohadón.");
      const paid = cutPct(0.08);
      S.invuln = Math.max(S.invuln || 0, 4);
      return say("Five days in Tulum. −" + money(paid) + ". About four seconds of feeling untouchable.",
        "Cinco días en Tulum. −" + money(paid) + ". Unos cuatro segundos de sentirte intocable.");
    }
    if (card.id === "flu") {
      const paid = cutBill(120);
      return say("Soup, medicine, half eaten by Paco. −" + money(paid) + ".", "Sopa, remedio, la mitad se la comió Paco. −" + money(paid) + ".");
    }
    if (card.id === "phish") {
      if (opt === "b") return say("Deleted. You stare at the empty inbox for thirty seconds anyway.", "Borrado. Igual mirás la bandeja treinta segundos.");
      const paid = cutPct(0.18);
      return say("The site looked convincing. So did the transaction. −" + money(paid) + ".",
        "El sitio se veía convincente. La transacción también. −" + money(paid) + ".");
    }
    if (card.id === "crash") {
      const paid = cutBill(650);
      return say("Nobody was hurt. The bumper still wants money. −" + money(paid) + ".",
        "Nadie se lastimó. El paragolpes igual quiere plata. −" + money(paid) + ".");
    }
    if (card.id === "wine") {
      if (opt === "a") return say("The conversation eventually turns to free will and incentives.",
        "The conversation eventually turns to free will and incentives.");
      if (opt === "b") {
        cutBill(17);
        return say("You finish the movie. Marek says the ending is overrated.\n\n−$17.",
          "You finish the movie. Marek says the ending is overrated.\n\n−$17.");
      }
      cutBill(25);
      return say("You leave thinking Marek may have made a good point.\n\n−$25.",
        "You leave thinking Marek may have made a good point.\n\n−$25.");
    }
    if (card.id === "casino") {
      if (opt === "c") return say("You leave. Nico stays.", "Te vas. Nico se queda.");
      const stake = cutPct(opt === "b" ? 0.3 : 0.1);
      if (Math.random() < 0.46) {
        S.cash += stake * 2;
        return say("The number hits. +" + money(stake * 2) + " on " + money(stake) + ".",
          "Sale el número. +" + money(stake * 2) + " sobre " + money(stake) + ".");
      }
      return say("The table does not know you. −" + money(stake) + ".", "La mesa no te conoce. −" + money(stake) + ".");
    }
    if (card.id === "poker") {
      if (opt === "c") return say("Marek joins you ten minutes later. \"Probably better.\" He says it without looking at you.",
        "Marek te alcanza a los diez minutos. \"Mejor.\" Lo dice sin mirarte.");
      const stake = cutPct(opt === "b" ? 0.25 : 0.08);
      const r = Math.random();
      if (r < 0.06) { S.cash += stake * 8; return say("You scoop the table. +" + money(stake * 8) + ".", "Te llevás la mesa. +" + money(stake * 8) + "."); }
      if (r < 0.28) { S.cash += stake * 3; return say("+" + money(stake * 3) + " on a " + money(stake) + " buy-in.", "+" + money(stake * 3) + " sobre " + money(stake) + "."); }
      if (r < 0.52) { S.cash += stake * 1.4; return say("Min-cash. +" + money(stake * 1.4) + ".", "Min-cash. +" + money(stake * 1.4) + "."); }
      return say("Busted. −" + money(stake) + ".", "Afuera. −" + money(stake) + ".");
    }
    if (card.id === "uncle") {
      if (Math.random() < 0.55) {
        const n = grantWealthPct(0.07);
        return say("Check your account. +" + money(n) + ".", "Fijate la cuenta. +" + money(n) + ".");
      }
      const b = Math.max(0.0001, (wealthUsd() * 0.07) / clampPx(S.price));
      S.btc += b;
      return say("He sent sats. +" + b.toFixed(4) + " BTC.", "Mandó sats. +" + b.toFixed(4) + " BTC.");
    }
    if (card.id === "school") {
      if (opt === "b") return say("They handle it. Sofi still sends a photo you cannot parse.", "Se arreglan. Sofi igual manda una foto que no entendés.");
      const paid = cutBill(300);
      return say("Sofi sends a photo from the museum. You have no idea what is in it. −" + money(paid) + ".",
        "Sofi manda una foto del museo. No sabés qué hay en la foto. −" + money(paid) + ".");
    }
    if (card.id === "roof") {
      const paid = cutBill(900);
      return say("Paco found it first. −" + money(paid) + ".", "Paco lo encontró primero. −" + money(paid) + ".");
    }
    if (card.id === "lotto") {
      const r = Math.random();
      if (r < 0.04) { const n = grantWealthPct(0.35); return say("Marek reads the numbers. Not bad. +" + money(n) + ".", "Marek lee los números. Nada mal. +" + money(n) + "."); }
      if (r < 0.45) { const n = grantWealthPct(0.012); return say("Marek: \"Not bad.\" He meant the odds. +" + money(n) + ".", "Marek: \"Nada mal.\" Hablaba de las probas. +" + money(n) + "."); }
      return say("You lost the ticket price. Marek was referring to the odds.", "Perdiste el ticket. Marek hablaba de las probas.");
    }
    if (card.id === "hospital") {
      const paid = cutBill(250);
      return say("Four stitches. Try not to bleed on anything. −" + money(paid) + ".", "Cuatro puntos. Tratá de no sangrar sobre nada. −" + money(paid) + ".");
    }
    if (card.id === "startup") {
      if (opt === "b") return say("Nico says: \"Your loss.\" You are fairly sure that is not how losses work.",
        "Nico: \"Tu pérdida.\" Estás bastante seguro de que las pérdidas no funcionan así.");
      const paid = cutPct(0.2);
      if (Math.random() < 0.28) {
        S.cash += paid * 4;
        return say("They actually ship. 4× on " + money(paid) + ".", "De verdad publican. 4× sobre " + money(paid) + ".");
      }
      return say("The domain expired. " + money(paid) + " is a case study.", "Venció el dominio. " + money(paid) + " es un caso de estudio.");
    }
    if (card.id === "tow") {
      const paid = cutBill(85);
      return say("Nine minutes. The sign was very clear. −" + money(paid) + ".", "Nueve minutos. El cartel estaba muy claro. −" + money(paid) + ".");
    }
    if (card.id === "courage") {
      if (opt === "b") return say("You go home. Lena asks why you are quiet. You say you are tired. \"Sure, Fartface.\"",
        "Volvés. Lena pregunta por qué estás callado. Decís que estás cansado. \"Claro, Fartface.\"");
      const paid = cutPct(0.06);
      return say("You are officially doing this. −" + money(paid) + ".", "Oficialmente lo estás haciendo. −" + money(paid) + ".");
    }
    if (card.id === "ring") {
      const paid = cutPct(opt === "b" ? 0.03 : 0.08);
      if (opt === "b") return say("You still have a ring. Lena later finds the receipt. She says nothing. She just looks at you. −" + money(paid) + ".",
        "Igual hay anillo. Lena después encuentra el ticket. No dice nada. Solo te mira. −" + money(paid) + ".");
      return say("You now have a ring. −" + money(paid) + ".", "Ahora hay anillo. −" + money(paid) + ".");
    }
    if (card.id === "date") {
      if (opt === "c") return say("Tomorrow is probably better.", "Mañana probablemente esté mejor.");
      const paid = cutBill(opt === "a" ? 180 : 60);
      if (opt === "a") return say("Everything goes according to plan. That still feels suspicious. −" + money(paid) + ".",
        "Todo sale según el plan. Sigue sintiéndose sospechoso. −" + money(paid) + ".");
      return say("Dinner is good anyway. −" + money(paid) + ".", "La cena está bien igual. −" + money(paid) + ".");
    }
    if (card.id === "proposal") {
      if (opt === "b") return say("You forget every word. You eventually say, \"So… anyway.\" The moment passes.",
        "Se te olvidan las palabras. Terminás diciendo: \"Bueno… eso.\" Se pasa el momento.");
      if (opt === "c") {
        const paid = cutPct(0.01);
        return say("You say \"Actually, forget it\" and start walking. Lena chases you. The ring survives. −" + money(paid) + ".",
          "Decís \"En realidad, olvidalo\" y arrancás. Lena te persigue. El anillo sobrevive. −" + money(paid) + ".");
      }
      const paid = cutPct(0.02);
      return say("You put the ring on her finger. \"Yes, Fartface.\" −" + money(paid) + ".",
        "Le ponés el anillo. \"Sí, Fartface.\" −" + money(paid) + ".");
    }
    if (card.id === "wedding") {
      if (opt === "a") {
        const paid = cutPct(0.12);
        return say("Everyone has a good time. Even Nico. His speech lasts eleven minutes. −" + money(paid) + ".",
          "Todos la pasan bien. Hasta Nico. El discurso dura once minutos. −" + money(paid) + ".");
      }
      if (opt === "b") {
        const paid = cutPct(0.05);
        return say("Fewer people. Less noise. Paco is not allowed to attend. He does not know why. −" + money(paid) + ".",
          "Menos gente. Menos ruido. Paco no puede entrar. No sabe por qué. −" + money(paid) + ".");
      }
      const paid = cutPct(0.01);
      return say("You disappear for the weekend. On Sunday she makes you go back for the cake. −" + money(paid) + ".",
        "Desaparecen el fin de semana. El domingo te hace volver por la torta. −" + money(paid) + ".");
    }
    if (card.id === "honeymoon") {
      const map = { a: 0.1, b: 0.06, c: 0.04 };
      const paid = cutPct(map[opt] || 0.04);
      if (opt === "a") return say("Tokyo, Kyoto, too many trains. The system works better than you do. −" + money(paid) + ".",
        "Tokio, Kioto, demasiados trenes. El sistema funciona mejor que vos. −" + money(paid) + ".");
      if (opt === "b") return say("Rome, Florence, long dinners. Lena buys something she refuses to explain until dinner. −" + money(paid) + ".",
        "Roma, Florencia, cenas largas. Lena compra algo que no explica hasta la cena. −" + money(paid) + ".");
      return say("Mountains, lakes, fewer people. You miss Paco after two days. He does not appear to miss you. −" + money(paid) + ".",
        "Montañas, lagos, menos gente. Extrañás a Paco a los dos días. Él no parece extrañarte. −" + money(paid) + ".");
    }
    if (card.id === "pregnancy") {
      const paid = cutBill(450);
      return say("Two lines. Then the planning. −" + money(paid) + ".", "Dos rayas. Después la planificación. −" + money(paid) + ".");
    }
    if (card.id === "baby") {
      if (opt === "c") return say("Lena looks at the PDF.\n\nThen at you—she's pissed.\n\n'Classic Fartface'.", "Lena looks at the PDF.\n\nThen at you—she's pissed.\n\n'Classic Fartface'.");
      if (opt === "a") {
        const paid = cutPct(0.05);
        S.cold += 1;
        return say("Money aside, and a cold-storage device in the house. −" + money(paid) + ".",
          "Plata de lado y un cold storage en casa. −" + money(paid) + ".");
      }
      const paid = cutPct(0.02);
      return say("You buy what you need and figure out the rest later. −" + money(paid) + ".",
        "Compran lo que hace falta y el resto después. −" + money(paid) + ".");
    }
    if (card.id === "cousin") {
      if (opt === "b") return say("Three hours later Nico texts. The token is already down 40%. \"Temporary.\"",
        "A las tres horas Nico escribe. El token ya va −40%. \"Temporal.\"");
      const paid = cutPct(0.4);
      if (Math.random() < 0.5) {
        S.cash += paid * 2.2;
        return say("Friday arrives early. 2.2× on " + money(paid) + ".", "El viernes llega temprano. 2.2× sobre " + money(paid) + ".");
      }
      return say("Halted. " + money(paid) + " is a screenshot now.", "Suspendido. " + money(paid) + " ahora es un screenshot.");
    }
    if (card.id === "speeding") {
      const paid = cutBill(75);
      return say("Same corner. Same officer. −" + money(paid) + ".", "La misma esquina. El mismo oficial. −" + money(paid) + ".");
    }
    if (card.id === "wallet") {
      const paid = cutBill(40);
      return say("Cash gone. Cards still there. Partial victory. −" + money(paid) + ".",
        "El efectivo no está. Las tarjetas sí. Victoria parcial. −" + money(paid) + ".");
    }
    if (card.id === "potluck") {
      if (opt === "b") return say("Lena looks at you. \"You are unbelievable.\"", "Lena te mira. \"Sos increíble.\"");
      const paid = cutPct(0.05);
      return say("People remember your name. Paco remembers the food. −" + money(paid) + ".",
        "La gente se acuerda de tu nombre. Paco, de la comida. −" + money(paid) + ".");
    }
    if (card.id === "usedcar") {
      if (opt === "b") return say("You walk. Nico buys it anyway.", "Te vas. Nico lo compra igual.");
      const paid = cutPct(0.12);
      if (Math.random() < 0.3) {
        const back = grantWealthPct(0.03);
        return say("It works. −" + money(paid) + " then +" + money(back) + ".", "Anda. −" + money(paid) + " y después +" + money(back) + ".");
      }
      const extra = cutPct(0.04);
      return say("Lemon. The Sharpie was the honest part. −" + money(paid + extra) + ".",
        "Limón. Lo honesto era el Sharpie. −" + money(paid + extra) + ".");
    }
    if (card.id === "tetris") {
      if (opt === "b") return say("Marek gets to level 18. Then loses. He nods. \"Good enough.\"",
        "Marek llega al nivel 18. Pierde. Asiente. \"Alcanza.\"");
      const stake = cutBill(20);
      if (Math.random() < 0.42) {
        S.cash += stake * 3;
        return say("The well stays clean. +" + money(stake * 3) + ".", "El pozo queda limpio. +" + money(stake * 3) + ".");
      }
      return say("A long bar would have saved you. −" + money(stake) + ".", "Una barra larga te salvaba. −" + money(stake) + ".");
    }
    if (card.id === "unclemike") {
      const bill = opt === "a" ? 220 : opt === "c" ? 195 : 180;
      cutBill(bill);
      if (opt === "a") return say("Uncle Mike watches you sign.\n\n“That just encourages the system.”\n\nYou leave the restaurant.\n\n−$220.",
        "Uncle Mike watches you sign.\n\n“That just encourages the system.”\n\nYou leave the restaurant.\n\n−$220.");
      if (opt === "b") return say("Uncle Mike seems satisfied.\n\nThe waiter does not.\n\nYou just want to go home.\n\n−$180.",
        "Uncle Mike seems satisfied.\n\nThe waiter does not.\n\nYou just want to go home.\n\n−$180.");
      return say("Uncle Mike nods.\n\n“That's different.”\n\nYou are not sure it is.\n\nHe is.\n\n−$195.",
        "Uncle Mike nods.\n\n“That's different.”\n\nYou are not sure it is.\n\nHe is.\n\n−$195.");
    }
    return say("Nothing else happens.", "No pasa nada más.");
  }

  function dealChance() {
    if (S.phase !== "play") return;
    if (!S.chanceUsed) S.chanceUsed = {};
    const introOf = {
      nico: "landfill", lena: "landfill", paco: "nicoWedding",
      marek: "wine", sofi: "school", hector: "uncle", mike: "unclemike"
    };
    const namesOf = {
      nico: ["Nico"], lena: ["Lena"], paco: ["Paco"],
      marek: ["Marek"], sofi: ["Sofi"],
      hector: ["Héctor", "Hector"], mike: ["Uncle Mike", "Mike"]
    };
    const unlocked = (c) => {
      if (c.after && c.after.some((id) => !S.chanceUsed[id])) return false;
      const blob = ((c.title || "") + " " + (c.body || "") + " " + (c.bodyEs || "")).toLowerCase();
      const who = Object.keys(introOf);
      for (let i = 0; i < who.length; i++) {
        const key = who[i];
        if (c.id === introOf[key]) continue;
        const aliases = namesOf[key];
        let hit = false;
        for (let j = 0; j < aliases.length; j++) {
          if (blob.indexOf(aliases[j].toLowerCase()) >= 0) { hit = true; break; }
        }
        if (hit && !S.chanceUsed[introOf[key]]) return false;
      }
      return true;
    };
    const pool = CHANCE_CARDS.filter((c) => !S.chanceUsed[c.id] && unlocked(c));
    const src = pool.length ? pool : CHANCE_CARDS.filter((c) => unlocked(c) && !S.chanceUsed[c.id]);
    if (!src.length) return;
    const card = src[(Math.random() * src.length) | 0];
    S.chanceUsed[card.id] = true;
    S.chanceCard = card;
    S.chanceNote = "";
    S.chanceLead = "";
    S.chanceSettled = false;
    S.arcPending = null;
    const es0 = chanceLang();
    let body = weaveCast(es0 ? (card.bodyEs || card.body) : card.body);
    if (card.kind === "report") {
      const before = { cash: S.cash, btc: S.btc, cold: S.cold };
      const note = resolveChance(card, "ok");
      S.arcPending = { cash: S.cash, btc: S.btc, cold: S.cold };
      S.cash = before.cash; S.btc = before.btc; S.cold = before.cold;
      S.chanceSettled = true;
      const clean = String(note || "").trim();
      const base = String(body || "").trim();
      const first = clean.split("\n")[0].trim();
      const same = !clean || base.indexOf(clean) >= 0 || (first && base.indexOf(first) >= 0 && clean.length < base.length);
      S.chanceBody = same ? base : (base + "\n\n" + clean);
    } else {
      S.chanceBody = body;
    }
    try { A.speak("Arc"); } catch (e) {}
    setPhase("chance");
    renderHud();
  }

  function commitArcBooks() {
    if (S.arcPending) {
      S.cash = S.arcPending.cash;
      S.btc = S.arcPending.btc;
      S.cold = S.arcPending.cold;
      S.arcPending = null;
    }
    try { renderHud(); } catch (e) {}
  }

  function pickChance(opt) {
    const card = S.chanceCard;
    if (!card) { setPhase("play"); renderHud(); return; }
    if (!S.chanceNote) {
      if (card.kind === "report" || S.chanceSettled) {
        commitArcBooks();
        S.chanceCard = null;
        S.chanceNote = "";
        S.chanceSettled = false;
        setPhase("play");
        renderHud();
        return;
      }
      const before = { cash: S.cash, btc: S.btc, cold: S.cold };
      S.chanceNote = resolveChance(card, opt);
      S.arcPending = { cash: S.cash, btc: S.btc, cold: S.cold };
      S.cash = before.cash; S.btc = before.btc; S.cold = before.cold;
      renderOverlay();
      renderHud();
      return;
    }
    commitArcBooks();
    S.chanceCard = null;
    S.chanceNote = "";
    S.chanceSettled = false;
    setPhase("play");
    renderHud();
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

  function perkOfferTitle() {
    if (S.ranked) {
      const n = S.perkFib || S.nextOffer || 1;
      const es = window.BZ && BZ.lang && BZ.lang() === "es";
      return es ? ("Fibonacci " + n + ": ¡agarrá tu perk!") : ("Fibonacci " + n + ": grab your perk!");
    }
    return t("grabPerk");
  }

  function tryRankedPerk(fromMarket) {
    if (!S.ranked) return false;
    if (S.phase === "perk") return false;
    if ((S.lasers || 0) < (S.nextOffer || 1)) return false;
    if (fromMarket || S.phase === "paused") {
      S.perkResume = { phase: "paused", panel: S.optPanel || "market" };
    } else {
      S.perkResume = null;
    }
    S.perkFib = S.nextOffer;
    openPerkOffer("laser", fromMarket || S.phase === "paused");
    return S.phase === "perk";
  }

  function openPerkOffer(why, forceUi) {
    const left = perkOpen();
    if (!left.length) return;
    rollPerks();
    if (!S.perkOffers || !S.perkOffers.length) return;
    if (S.perkOffers[S.perkOffers.length - 1] !== "skip") S.perkOffers.push("skip");
    S.perkPick = "";
    if (why === "laser") say("Fibonacci treshold reached, grab your perk!", true);
    if (!forceUi && S.aibudOn && (S.have.aibud || 0) >= 2) {
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

  function fibSeq(n) {
    const s = [1, 2];
    while (s.length < n) {
      s.push(s[s.length - 1] + s[s.length - 2]);
    }
    return s;
  }

  function bumpOffer() {
    S.offersDone += 1;
    if (S.ranked) {
      const s = S.offerSeq && S.offerSeq.length ? S.offerSeq : fibSeq(16);
      S.offerSeq = s;
      while (s.length <= S.offersDone) {
        const i = s.length;
        s.push(s[i - 1] + s[i - 2]);
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
    if (id === "adopt") return es ? "Ciclos más suaves a ambos lados" : "Milder cycles both ways";
    if (id === "manip") return es ? "Mover el precio si holdeamos" : "Steer price while we hold";
    if (id === "aibud") return es ? "A.I. bud sube de nivel" : "A.I. bud levels up";
    if (id === "ff") return es ? "Más tablero, más monedas" : "More board, more coins";
    if (id === "juke") return es ? "Música mientras stackeamos" : "Tunes while we stack";
    if (id === "job") return es ? "Sueldo fijo cada 21 velas" : "Steady paycheck every 21 candles";
    if (id === "market") return es ? "Comprar vidas y láseres" : "Buy lives and lasers";
    if (id === "chance") return es ? "Cartas Arc cada 21 velas" : "Arc cards every 21 candles";
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
    const inSwan = !!S.swanBear;
    const inBear = S.power === "BEAR" || inSwan;
    const inBull = S.power === "BULL";
    const incomingDump = incomingKind(["BEAR", "SWAN"], 2.8);
    const incomingPump = incomingKind(["BULL", "HALVE"], 2.8);
    const u = cycleU();
    const bullPeak = inBull && (u >= 0.52 || S.powerT < 1.35);
    let acted = false;

    if (t >= 4 && canAiTrade()) {
      const bag = netBtc();
      const shouldSell = S.btc > 0 && !inBear && (bullPeak || incomingDump);
      const shouldBuy = S.cash > 0 && !inBull && (inBear || incomingPump);
      if (shouldSell) {
        S.aiSilent = true; sellBtc(); S.aiSilent = false;
        S.iaProfit += netBtc() - bag;
        S.aibudLit = Object.assign({}, S.aibudLit, { sell: true, buy: false });
        S.aiTradeAt = S.candles || 0;
        markAiTrade();
        aiAct("Sold BTC", incomingDump ? "Dump incoming · raise cash for the dip" : "Sold the bull · raise cash for the dip");
        acted = true;
      } else if (shouldBuy) {
        S.aiSilent = true; buyBtc(); S.aiSilent = false;
        S.iaProfit += netBtc() - bag;
        S.aibudLit = Object.assign({}, S.aibudLit, { buy: true, sell: false });
        S.aiTradeAt = S.candles || 0;
        markAiTrade();
        aiAct("Bought BTC", incomingPump ? "Pump incoming · accumulate" : (inSwan ? "Bought the black swan" : "Bought the bear"));
        acted = true;
      }
    }

    if (t >= 3 && S.have.dca > 0) {
      const want = !!(inBear && !inBull);
      if (want !== !!S.dcaOn) {
        S.dcaOn = want;
        S.aibudLit = Object.assign({}, S.aibudLit, { dca: true });
        aiAct(want ? "DCA ON" : "DCA OFF", want ? "Bear/swan · income to bitcoin" : "Bull · do not buy the top");
        acted = true;
      }
    }

    if (t >= 3 && S.have.manip > 0) {
      const holding = (S.btc || 0) > 1e-12;
      const want = holding ? "up" : "down";
      if (want !== S.trend) {
        S.trend = want;
        S.aibudLit = Object.assign({}, S.aibudLit, { trend: true });
        aiAct(want === "up" ? "Trend UP" : "Trend DOWN", holding ? "Holding · pump the bag" : "Flat · cheaper next buy");
        acted = true;
      }
    }
    if (acted) {
      try { renderHud(); } catch (e) {}
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

  function themeHooks() {
    return [
      () => S.power,
      () => S.phase === "play",
      () => !!(S.jukeOn && A && A.jukePlaying && A.jukePlaying())
    ];
  }
  function kickTheme() {
    if (!A || !A.startMusic) return;
    try {
      if (A.unlock) A.unlock();
      A.startMusic.apply(A, themeHooks());
    } catch (e) {}
  }

  function setPhase(p) {
    S.phase = p;
    try {
      if (A) {
        if (p === "play") kickTheme();
        else if (A.stopMusic) A.stopMusic();
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
    if (A && A.startMusic) kickTheme();
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
    for (const f of S.floats) f.x -= speed * dt;
    if (S.power === "BULL" || S.power === "BEAR") {
      S.cycleManip = Math.max(0.15, (S.cycleManip || 1) * (1 + trendBias() * dt));
      const now = S.lifeT;
      const dur = WAVE_UP + WAVE_BACK;
      let sum = 0;
      let live = false;
      for (const w of (S.waves || [])) {
        sum += waveK(w, now);
        if (now < w.t0 + dur) live = true;
      }
      S.price = clampPx((S.priceBase || S.cycleStart || S.price) * (1 + sum) * S.cycleManip);
      if (S.level >= 2 && S.vtCycle > 0) S.vtPrice = Math.max(1, S.vtCycle * (1 + sum * 0.45) * S.cycleManip);
      noteCyclePrice();
      syncWaveFlags();
      if (!live) endCycle();
    } else {
      const bias = trendBias();
      const mid = bias > 0.001 ? 0.42 : bias < -0.001 ? 0.58 : 0.48;
      const px = clampPx(S.price);
      S.price = clampPx(px + (Math.random() - mid) * px * 0.012 * dt + px * bias * dt);
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
      if (!p.seen && p.x + pw >= 0 && p.x <= S.W) {
        p.seen = true;
        S.shownCandles = (S.shownCandles || 0) + 1;
        tickHalve();
      }
      if (!p.scored && p.x + pw < S.bird.x) {
        p.scored = true; S.candles++; A.sfx.coin();
        grantUsd(100, p.x + pw * 0.5, p.gapY - 50, "gain");
        tickJobChance();
        if (!S.ranked && S.candles > 0 && S.candles % 10 === 0) openPerkOffer();
      }
      const inX = S.bird.x + hitR > p.x + 2 && S.bird.x - hitR < p.x + pw - 2;
      if (inX) {
        const ends = pipeEnds(p);
        if (S.bird.y - hitR < ends.top + 2 || S.bird.y + hitR > ends.bot - 2) {
          if (S.power === "BULL") { burst(p.x + pw * 0.5, S.bird.y, GREEN, 8); A.sfx.wave(); grantUsd(200, p.x + pw * 0.5, S.bird.y - 66, "gain"); S.pipes.splice(i, 1); continue; }
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
    let visHi = vis[0].h, visLo = vis[0].l;
    for (const b of vis) { if (b.l < visLo) visLo = b.l; if (b.h > visHi) visHi = b.h; }
    let lo = visLo, hi = visHi;
    const span = Math.max(0.01, hi - lo);
    const mid = (lo + hi) / 2;
    const fade = Math.max(0, 1 - (data.length / 100));
    const zoom = 1 + 0.5 * fade;
    const view = span * zoom;
    lo = mid - view / 2;
    hi = mid + view / 2;
    const pad = span * 0.08;
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
    const startB = buckets.length > maxFit ? buckets.length - maxFit : 0;
    const marks = (S.tapeMarks || []).concat(S.tapeLive ? [S.tapeLive] : []);
    if (marks.length) {
      ctx.save();
      ctx.font = "700 8px \"IBM Plex Mono\", monospace";
      ctx.textAlign = "center";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(10,10,12,0.82)";
      for (const mk of marks) {
        const vi = Math.floor((mk.i || 0) / bucket) - startB;
        if (vi < 0 || vi >= vis.length) continue;
        const peak = mk.kind === "peak";
        const x = 10 + vi * stepX + cw / 2;
        const y = py(mk.price) + (peak ? -5 : 5);
        ctx.textBaseline = peak ? "bottom" : "top";
        ctx.fillStyle = peak ? GREEN : RED;
        const lab = fmtUsd(mk.price);
        ctx.strokeText(lab, x, y);
        ctx.fillText(lab, x, y);
      }
      ctx.restore();
    }
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
    const candles = $("h-candles");
    const hideClock = S.phase === "ready" || S.phase === "count";
    if (clock) {
      clock.textContent = fmtTime(S.lifeT);
      clock.classList.toggle("hide", hideClock);
    }
    if (candles) {
      candles.textContent = String(S.shownCandles || 0);
      candles.classList.toggle("hide", hideClock);
    }
    const box = $("clock-box");
    if (box) box.classList.toggle("hide", hideClock);
    setTxt("h-cash", money(S.cash));
    setTxt("h-btc", fmtBtcAmt(S.btc));
    setTxt("h-price", money(S.price));
    setTxt("h-cold", String(S.cold));
    setTxt("h-msig", String(S.msig));
    setTxt("h-laser", String(S.lasers || 0));
    setTxt("h-fib", String(S.ranked ? (S.nextOffer || 1) : 0));
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
      const list = ffSpeeds();
      if (!list.some((x) => Math.abs(x - (S.speedMul || 1)) < 0.001)) S.speedMul = 1;
      const sm = S.speedMul || 1;
      spd2.textContent = (sm % 1 ? sm.toFixed(1) : String(sm)) + "X";
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
    const playing = S.phase === "play" || S.phase === "paused" || S.phase === "perk" || S.phase === "chance";
    $("trades").classList.toggle("hide", !playing);
    $("pause-btn").classList.toggle("hide", !playing);
    let powers = "";
    if (S.halveBull) powers = t("halvingNow") + "  " + Math.ceil(S.powerT) + "s";
    else if (S.power === "BULL") powers = t("bullRun") + "  " + Math.ceil(S.powerT) + "s";
    else if (S.power === "BEAR") powers = t("bearCrash") + "  " + Math.ceil(S.powerT) + "s";
    if (S.laserOn) powers = powers ? powers + "  ·  " + t("laserNow") + " " + Math.ceil(S.laserT) + "s" : t("laserNow") + "  " + Math.ceil(S.laserT) + "s";
    const jobEl = $("status-job");
    const powEl = $("status-powers");
    if (powEl) { powEl.textContent = powers; powEl.classList.toggle("hide", !powers); }
    if (jobEl) { jobEl.textContent = S.jobName || ""; jobEl.classList.toggle("hide", !S.jobName); }
    if (!powEl && !jobEl) $("status").textContent = powers && S.jobName ? powers + "  ·  " + S.jobName : (powers || S.jobName || "");
    $("status").classList.toggle("hide", !((powers || S.jobName) && S.phase === "play"));
    const cap = $("caption");
    if (cap) {
      cap.textContent = S.ticker || "";
      cap.classList.toggle("hide", !S.ticker || S.phase !== "play");
    }
    paintJukeUi();
  }

  function paintJukeHud() {
    const box = $("juke-hud");
    if (!box) return;
    const ready = (S.have.juke || 0) > 0;
    box.classList.toggle("locked", !ready);
    const title = $("juke-hud-title");
    const id = (S.jukeList || [])[S.jukeTrack];
    const song = id && A.SONGS && A.SONGS[id];
    const playing = !!(A.jukePlaying && A.jukePlaying());
    const paused = !!(A.jukePaused && A.jukePaused());
    if (title) {
      if (song && (playing || paused || S.jukeOn)) title.textContent = song.title || t("jukebox");
      else title.textContent = t("jukebox");
    }
    const play = $("juke-hud-play");
    if (play) {
      play.textContent = playing ? "❚❚" : "▶";
      play.classList.toggle("on", playing);
      play.disabled = !ready;
    }
    const vol = $("juke-hud-vol");
    if (vol) {
      vol.disabled = !ready;
      if (!vol.matches(":active") && document.activeElement !== vol) {
        const pct = Math.round(((A.jukeVolume && A.jukeVolume()) || 0.8) * 100);
        if (String(vol.value) !== String(pct)) vol.value = String(pct);
      }
    }
  }

  function paintJukeUi() {
    paintJukeHud();
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
    const keep = (S.jukeList || [])[S.jukeTrack];
    S.jukeList = S.jukeUnlock.slice(0, n);
    const idx = keep ? S.jukeList.indexOf(keep) : -1;
    S.jukeTrack = idx >= 0 ? idx : 0;
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
      const mul = S.ranked ? 10 : 1;
      const cold = 1200 * mul, laser = 1800 * mul, msig = 9000 * mul;
      return "<h1>" + t("market") + "</h1>"
        + "<p class=\"k\">" + money(S.cash) + "</p>"
        + "<button class=\"cta\" data-buy=\"cold\">Cold storage · " + money(cold) + "</button>"
        + "<button class=\"cta\" data-buy=\"laser\">Laser eyes · " + money(laser) + "</button>"
        + "<button class=\"cta\" data-buy=\"msig\">Multisig · " + money(msig) + "</button>"
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
        const mul = S.ranked ? 10 : 1;
        const cost = (kind === "cold" ? 1200 : kind === "laser" ? 1800 : 9000) * mul;
        if (S.cash < cost) { say("Not enough cash", false); renderOverlay(); return; }
        S.cash -= cost;
        if (kind === "cold") S.cold += 1;
        else if (kind === "laser") {
          S.lasers += 1;
          if (S.laserOn) S.laserT += POWER_S; else applyLaser(true);
          A.sfx.coin();
          renderHud();
          if (tryRankedPerk(true)) return;
          renderOverlay();
          return;
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
    overlay.classList.toggle("chance-ui", p === "chance");
    overlay.classList.toggle("juke-ui", (p === "paused" || p === "ready") && S.optPanel === "juke");
    if (p === "ready") {
      if (S.optPanel) {
        overlay.innerHTML = pauseMarkup();
        bindPauseUi();
      } else {
        overlay.innerHTML = "<h1>Choppy Bitcoin</h1>"
          + "<button class=\"cta\" id=\"go\">" + t("ranked") + "</button>"
          + "<p class=\"k\">" + t("playSub") + "</p>"
          + "<button type=\"button\" class=\"cta play-alt\" id=\"go-train\">" + t("training") + "</button>"
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
      const body = S.chanceBody || (es ? (card.bodyEs || card.body) : card.body);
      const art = "chance/" + card.id + ".jpg";
      const pic = "<img class=\"chance-art\" src=\"" + art + "\" alt=\"\" onerror=\"this.src='chance/hero.jpg'\">";
      let btns = "";
      if (S.chanceNote) {
        btns = "<button class=\"cta\" data-ch=\"ok\">" + t("chanceAck") + "</button>";
        overlay.innerHTML = "<h1>" + t("chanceHead") + "</h1>" + pic + "<p class=\"k\">" + title + "</p><p class=\"arc-body\">" + S.chanceNote + "</p><div class=\"arc-actions\">" + btns + "</div>";
      } else {
        btns = (card.opts || []).map((o) => {
          const lab = es ? (o.labelEs || o.label) : o.label;
          return "<button class=\"cta\" data-ch=\"" + o.k + "\">" + lab + "</button>";
        }).join("");
        if (!btns) btns = "<button class=\"cta\" data-ch=\"ok\">" + t("chanceAck") + "</button>";
        overlay.innerHTML = "<h1>" + t("chanceHead") + "</h1>" + pic + "<p class=\"k\">" + title + "</p><p class=\"arc-body\">" + body + "</p><div class=\"arc-actions\">" + btns + "</div>";
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
          ? "<span class=\"perk-name\">" + t("declinePerk") + "</span><span class=\"perk-desc\">" + t("declinePerkSub") + "</span>"
          : "<span class=\"perk-name\">" + perkTitle(id, tier) + "</span><span class=\"perk-desc\">" + perkBlurb(id, tier) + "</span>";
        return "<button class=\"cta" + (id === "skip" ? " play-alt" : "") + (sel ? " on" : "") + "\" data-perk=\"" + id + "\">" + (sel ? "✓ " : "") + label + "</button>";
      }).join("");
      overlay.innerHTML = "<h1>" + perkOfferTitle() + "</h1><p>" + (chosen ? t("selected") : t("pickOne")) + (S.perkHint ? "</p><p class=\"k\">A.I. bud: " + perkTitle(S.perkHint, S.poolTier[S.perkHint] || 1) + " — " + perkWhy(S.perkHint) : "") + "</p><div class=\"perk-list\">" + btns + "</div>";
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
  const authHud = $("btn-show-auth");
  if (authHud) authHud.onpointerdown = (e) => {
    e.stopPropagation();
    if (S.phase === "play") { S.optBack = "play"; S.optPanel = null; setPhase("paused"); }
  };
  window.pauseChoppyForAuth = function () {
    if (S.phase === "play") { S.optBack = "play"; S.optPanel = null; setPhase("paused"); }
  };
  const jukeHudPlay = $("juke-hud-play");
  if (jukeHudPlay) jukeHudPlay.onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    if ((S.have.juke || 0) <= 0) return;
    if ((A.jukePlaying && A.jukePlaying()) || (A.jukePaused && A.jukePaused())) jukePause();
    else jukePlay();
    paintJukeHud();
  };
  const jukeVol = $("juke-hud-vol");
  if (jukeVol) {
    const applyVol = (e) => {
      if (e) e.stopPropagation();
      if ((S.have.juke || 0) <= 0 || !A.setJukeVolume) return;
      A.setJukeVolume((Number(jukeVol.value) || 0) / 100);
    };
    jukeVol.onpointerdown = (e) => e.stopPropagation();
    jukeVol.onpointerup = (e) => e.stopPropagation();
    jukeVol.onclick = (e) => e.stopPropagation();
    jukeVol.oninput = applyVol;
    jukeVol.onchange = applyVol;
  }
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
      cycleSpeed();
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
