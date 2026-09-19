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
  const BTC_CAP = 21e6;
  let GREEN = "#4f9d6e";
  let RED = "#c45c4a";
  let BTC = "#c8960a";
  const PALETTES = {
    classic: {
      nameKey: "palClassic",
      bg: "#0a0a0c", bgTop: "#16140e", bgBot: "#070708", glow: "rgba(200,150,10,0.18)",
      fg: "#f3efe6", gold: "#c8960a", ink: "#09090b",
      line: "#2a2a2e", muted: "#8a8680", surface: "#141416", border: "#3a3a40",
      hud: "#fff6d0", green: "#4f9d6e", red: "#c45c4a",
      grid: "rgba(243,239,230,0.14)", bullBg: "#052010", bearBg: "#200505",
      halo: "rgba(0,0,0,0.88)", labelUp: "#8ee0a8", labelDn: "#ff9a8c",
      card: "#1a1a1e", cardFg: "#f3efe6", desc: "#c4c0b6"
    },
    midnight: {
      nameKey: "palMidnight",
      bg: "#070b18", bgTop: "#122048", bgBot: "#03040c", glow: "rgba(90,150,255,0.38)",
      fg: "#dce6f5", gold: "#7eb6ff", ink: "#041018",
      line: "#1c2740", muted: "#7a88a4", surface: "#0e1524", border: "#2a3a58",
      hud: "#d6e8ff", green: "#3dba8c", red: "#e06a7a",
      grid: "rgba(126,182,255,0.12)", bullBg: "#041820", bearBg: "#180814",
      halo: "rgba(0,0,0,0.9)", labelUp: "#b8f0d0", labelDn: "#ffb4bc",
      card: "#0e1524", cardFg: "#e8f0fc", desc: "#b4c4dc"
    },
    terminal: {
      nameKey: "palTerminal",
      bg: "#020904", bgTop: "#063014", bgBot: "#010402", glow: "rgba(70,255,100,0.22)",
      fg: "#b6f5b0", gold: "#5dff6a", ink: "#021004",
      line: "#143318", muted: "#5a8a58", surface: "#06140a", border: "#1c4a22",
      hud: "#c8ffc4", green: "#3adf5a", red: "#ff5a4a",
      grid: "rgba(93,255,106,0.1)", bullBg: "#032010", bearBg: "#180808",
      halo: "rgba(0,0,0,0.92)", labelUp: "#d0ffcc", labelDn: "#ffc0b4",
      card: "#06140a", cardFg: "#d8ffd4", desc: "#a8e0b0"
    },
    paper: {
      nameKey: "palPaper",
      bg: "#f3ead8", bgTop: "#fbf6ea", bgBot: "#e4d5bc", glow: "rgba(176,122,16,0.16)",
      fg: "#1a1610", gold: "#b07a10", ink: "#1a1610",
      line: "#c8bba4", muted: "#4a443c", surface: "#f6efe2", border: "#b8aa90",
      hud: "#5a4010", green: "#2f7a4a", red: "#b44a3a",
      grid: "rgba(26,22,16,0.1)", bullBg: "#d8ead8", bearBg: "#ead8d4",
      halo: "rgba(255,255,255,0.92)", labelUp: "#14532d", labelDn: "#9a2218",
      card: "#fff8ee", cardFg: "#1a1610", desc: "#4a443c"
    },
    neon: {
      nameKey: "palNeon",
      bg: "#0c0314", bgTop: "#2a0a48", bgBot: "#050108", glow: "rgba(255,74,210,0.42)",
      fg: "#f4e8ff", gold: "#ff4ad2", ink: "#120414",
      line: "#3a1848", muted: "#a888b8", surface: "#16081c", border: "#5a2870",
      hud: "#ffd0f4", green: "#2ee6c8", red: "#ff4a7a",
      grid: "rgba(255,74,210,0.12)", bullBg: "#041816", bearBg: "#180410",
      halo: "rgba(0,0,0,0.9)", labelUp: "#b8fff4", labelDn: "#ffc0dc",
      card: "#16081c", cardFg: "#ffe8ff", desc: "#e0c4f0"
    },
    sunset: {
      nameKey: "palSunset",
      bg: "#2a1018", bgTop: "#c45a40", bgBot: "#12080c", glow: "rgba(255,138,58,0.48)",
      fg: "#ffe8d4", gold: "#ff8a3a", ink: "#1a0808",
      line: "#4a2030", muted: "#c89888", surface: "#221018", border: "#6a3040",
      hud: "#ffd0b0", green: "#e8a040", red: "#e05050",
      grid: "rgba(255,138,58,0.12)", bullBg: "#181000", bearBg: "#180808",
      halo: "rgba(0,0,0,0.92)", labelUp: "#ffe9b8", labelDn: "#ffd0c8",
      card: "#2a1018", cardFg: "#fff0e4", desc: "#f0c8b8"
    },
    flower: {
      nameKey: "palFlower",
      bg: "#3a1050", bgTop: "#e040a8", bgBot: "#1a0840", glow: "rgba(255,80,220,0.5)",
      fg: "#fff4c8", gold: "#ffe14a", ink: "#2a0838",
      line: "#6a2880", muted: "#e8a8d8", surface: "#4a1868", border: "#c050c8",
      hud: "#fff0a0", green: "#7dff6a", red: "#ff4aa8",
      grid: "rgba(255,80,220,0.14)", bullBg: "#143018", bearBg: "#301018",
      halo: "rgba(0,0,0,0.9)", labelUp: "#f0ffc0", labelDn: "#ffe0f8",
      card: "#2a0840", cardFg: "#fff8d8", desc: "#f4d0ec"
    },
    simple: {
      nameKey: "palSimple",
      bg: "#f2f2f0", bgTop: "#f2f2f0", bgBot: "#f2f2f0", glow: "transparent",
      fg: "#161616", gold: "#222222", ink: "#ffffff",
      line: "#d0d0cc", muted: "#3a3a38", surface: "#ffffff", border: "#b8b8b4",
      hud: "#161616", green: "#2a2a2a", red: "#2a2a2a",
      grid: "rgba(22,22,22,0.06)", bullBg: "#e8e8e6", bearBg: "#e8e8e6",
      halo: "rgba(255,255,255,0.95)", labelUp: "#111111", labelDn: "#111111",
      card: "#ffffff", cardFg: "#161616", desc: "#3a3a38"
    }
  };
  let PAL = PALETTES.classic;
  let PALETTE_ID = "classic";
  const HERO_SKINS = {
    classic: { fill:"#f2a900", rim:"#ffe7a0", dark:"#c48400", edge:"#8a5a00", ink:"#1a0c06", btc:"#9a9aa2", band:"#e02420", halo:"#fff4d6", lensF:"#0a0a0c", lensB:"#1a1a1e", limb:"#1a0c06", mark:"₿", style:"coin" },
    midnight:{ fill:"#9ec4ff", rim:"#e8f0ff", dark:"#4a6aa0", edge:"#2a4068", ink:"#041018", btc:"#e8eefc", band:"#3d6adf", halo:"#d6e8ff", lensF:"#0a1428", lensB:"#1a2848", limb:"#c5d8ff", mark:"₿", style:"rocket", glow:"rgba(126,182,255,0.4)" },
    terminal:{ fill:"#163416", rim:"#5dff6a", dark:"#0a200a", edge:"#082008", ink:"#021004", btc:"#5dff6a", band:"#3adf5a", halo:"#c8ffc4", lensF:"#021004", lensB:"#0a280a", limb:"#5dff6a", mark:"₿", style:"pixel", glow:"rgba(93,255,106,0.28)" },
    paper:   { fill:"#e6c24a", rim:"#1a1610", dark:"#d4a06a", edge:"#b8aa90", ink:"#1a1610", btc:"#1a1610", band:"#e07a8a", halo:"#fff8ee", lensF:"#1a1610", lensB:"#3a3228", limb:"#1a1610", mark:"₿", style:"pencil" },
    neon:    { fill:"#ff4ad2", rim:"#ffd0f4", dark:"#a02080", edge:"#5a1060", ink:"#120414", btc:"#fff0ff", band:"#2ee6c8", halo:"#ffd0f4", lensF:"#1a0420", lensB:"#3a0850", limb:"#2ee6c8", mark:"₿", style:"glow", glow:"rgba(255,74,210,0.48)" },
    sunset:  { fill:"#ff8a3a", rim:"#ffd0b0", dark:"#c45a40", edge:"#8a3020", ink:"#1a0808", btc:"#ffe8d4", band:"#e05050", halo:"#ffe0c8", lensF:"#2a1010", lensB:"#4a1818", limb:"#1a0808", mark:"₿", style:"sun", glow:"rgba(255,138,58,0.4)" },
    flower:  { fill:"#ffe14a", rim:"#fff4c8", dark:"#e040a8", edge:"#c050c8", ink:"#2a0838", btc:"#6a2880", band:"#ff4aa8", halo:"#fff0a0", lensF:"#3a1050", lensB:"#5a2080", limb:"#7dff6a", mark:"₿", style:"hippie", glow:"rgba(255,80,220,0.32)" },
    simple:  { fill:"#222222", rim:"#161616", dark:"#111111", edge:"#000000", ink:"#ffffff", btc:"#f2f2f0", band:"#222222", halo:"#ffffff", lensF:"#000000", lensB:"#333333", limb:"#161616", mark:"₿", style:"flat" }
  };
  let HERO_SKIN = "classic";
  let HERO_ANIM = false;
  function heroSkin(id) { return HERO_SKINS[id] || HERO_SKINS.classic; }
  function currentPaletteId() { return PALETTE_ID; }
  function applyPalette(id) {
    if (!PALETTES[id]) id = "classic";
    const p = PALETTES[id];
    PALETTE_ID = id;
    PAL = p;
    GREEN = p.green;
    RED = p.red;
    BTC = p.gold;
    try { localStorage.setItem("choppy-palette", id); } catch (e) {}
    const vars = {
      "--bg": p.bg, "--fg": p.fg, "--gold": p.gold, "--ink": p.ink,
      "--line": p.line, "--muted": p.muted, "--surface": p.surface,
      "--border": p.border, "--hud": p.hud, "--green": p.green, "--red": p.red,
      "--bg-top": p.bgTop || p.bg, "--bg-bot": p.bgBot || p.bg, "--bg-glow": p.glow || "transparent",
      "--card": p.card || p.surface, "--card-fg": p.cardFg || p.fg, "--desc": p.desc || p.muted
    };
    [document.documentElement, document.body, document.getElementById("app")].forEach((el) => {
      if (!el) return;
      el.setAttribute("data-palette", id);
      Object.keys(vars).forEach((k) => el.style.setProperty(k, vars[k]));
    });
  }
  function loadPalette() {
    let id = "";
    try { id = localStorage.getItem("choppy-palette") || ""; } catch (e) { id = ""; }
    if (!id || !PALETTES[id]) {
      const keys = Object.keys(PALETTES);
      id = keys[(Math.random() * keys.length) | 0];
    }
    applyPalette(id);
  }
  function setHero(skin, anim) {
    HERO_SKIN = HERO_SKINS[skin] ? skin : "classic";
    HERO_ANIM = !!anim;
    try { localStorage.setItem("choppy-hero", HERO_SKIN + ":" + (HERO_ANIM ? "1" : "0")); } catch (e) {}
  }
  function loadHero() {
    try {
      const raw = localStorage.getItem("choppy-hero") || "";
      if (raw.indexOf(":") >= 0) {
        const p = raw.split(":");
        HERO_SKIN = HERO_SKINS[p[0]] ? p[0] : PALETTE_ID;
        HERO_ANIM = p[1] === "1";
        return;
      }
      if (localStorage.getItem("choppy-anim-hero") === "1") {
        HERO_SKIN = "classic";
        HERO_ANIM = true;
        return;
      }
    } catch (e) {}
    HERO_SKIN = PALETTE_ID;
    HERO_ANIM = false;
  }
  let ARC_TLDR = false;
  function setArcTldr(on) {
    ARC_TLDR = !!on;
    try { localStorage.setItem("choppy-arc-tldr", ARC_TLDR ? "1" : "0"); } catch (e) {}
  }
  function loadArcTldr() {
    try { ARC_TLDR = localStorage.getItem("choppy-arc-tldr") === "1"; } catch (e) { ARC_TLDR = false; }
  }
  function palRgba(hex, a) {
    let h = String(hex || "#000").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h.slice(0, 6), 16);
    if (!isFinite(n)) return "rgba(0,0,0," + a + ")";
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }
  loadPalette();
  loadHero();
  loadArcTldr();
  const PX_MIN = 1;
  const DRIFT0 = 0.0006;
  const PHI = (1 + Math.sqrt(5)) / 2;
  const DRIFT_GROW = 1 + (PHI - 1) * 0.5;
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
    if (kind === "rank") return wrap("<text x=\"0\" y=\"1.2\" text-anchor=\"middle\" dominant-baseline=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#120c02\" font-family=\"IBM Plex Mono,monospace\">#1</text>", "#c8960a", "#ffe7a0");
    if (kind === "perk") return wrap("<polygon points=\"0,-8 2.2,-2.2 8,-2.2 3.4,1.6 5.2,7.5 0,4 -5.2,7.5 -3.4,1.6 -8,-2.2 -2.2,-2.2\" fill=\"#ffe7a0\"/>", "#141416", "#c8960a");
    if (kind === "gfx") return wrap("<g><circle cx=\"-4.2\" cy=\"1.2\" r=\"3.4\" fill=\"#0a0a0c\"/><circle cx=\"0.4\" cy=\"-3.2\" r=\"3.4\" fill=\"#c8960a\"/><circle cx=\"4\" cy=\"2.4\" r=\"3.4\" fill=\"#4f9d6e\"/></g>", "#141416", "#c8960a");
    return wrap("", "#141416", "#3a3a40");
  }
  const HEROES = [
    { id: "btc", fill: "#F2A900", ink: "#120c02", ring: "#ffe7a0", mark: "btc" },
    { id: "usdt", fill: "#26A17B", ink: "#ffffff", ring: "#9dffc4", mark: "usdt" },
    { id: "eth", fill: "#627EEA", ink: "#ffffff", ring: "#c5d4ff", mark: "eth" },
    { id: "bch", fill: "#0AC18E", ink: "#04120c", ring: "#9dffc4", mark: "bch" },
    { id: "xrp", fill: "#23292F", ink: "#E5E5E5", ring: "#8a9098", mark: "xrp" },
    { id: "bnb", fill: "#F3BA2F", ink: "#120c02", ring: "#ffe7a0", mark: "bnb" },
    { id: "sol", fill: "#9945FF", ink: "#ffffff", ring: "#d4b3ff", mark: "sol" },
    { id: "trx", fill: "#FF0013", ink: "#ffffff", ring: "#ff9b92", mark: "trx" }
  ];
  function heroOf(slot) { return HEROES[(slot | 0) % HEROES.length] || HEROES[0]; }
  function myHero() {
    const slot = (window.ChoppyMP && window.ChoppyMP.slot) ? window.ChoppyMP.slot() : (S.mpSlot || 0);
    return heroOf(S.mp ? slot : 0);
  }
  function drawHeroMark(ctx, hero, r) {
    ctx.save();
    const ink = hero.ink;
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1.4, r * 0.16);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    const m = hero.mark;
    if (m === "btc") {
      ctx.font = "700 " + Math.round(r * 1.15) + "px Georgia, serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("₿", 0, 1);
    } else if (m === "usdt") {
      ctx.font = "700 " + Math.round(r * 1.05) + "px Georgia, serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("₮", 0, 1);
    } else if (m === "eth") {
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(r * 0.38, r * 0.02);
      ctx.lineTo(0, r * 0.18);
      ctx.lineTo(-r * 0.38, r * 0.02);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, r * 0.22);
      ctx.lineTo(r * 0.38, r * 0.06);
      ctx.lineTo(0, r * 0.58);
      ctx.lineTo(-r * 0.38, r * 0.06);
      ctx.closePath(); ctx.globalAlpha *= 0.85; ctx.fill(); ctx.globalAlpha = 1;
    } else if (m === "bch") {
      ctx.font = "700 " + Math.round(r * 0.95) + "px Georgia, serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("₿", 0, 1);
      ctx.lineWidth = Math.max(1.2, r * 0.12);
      ctx.beginPath(); ctx.moveTo(r * 0.18, -r * 0.42); ctx.lineTo(r * 0.48, -r * 0.18); ctx.stroke();
    } else if (m === "xrp") {
      ctx.beginPath();
      ctx.moveTo(-r * 0.38, -r * 0.34); ctx.lineTo(-r * 0.08, 0); ctx.lineTo(-r * 0.38, r * 0.34);
      ctx.moveTo(r * 0.38, -r * 0.34); ctx.lineTo(r * 0.08, 0); ctx.lineTo(r * 0.38, r * 0.34);
      ctx.stroke();
    } else if (m === "bnb") {
      ctx.save(); ctx.rotate(Math.PI / 4);
      const s = r * 0.42;
      ctx.fillRect(-s, -s, s * 2, s * 2);
      ctx.restore();
    } else if (m === "sol") {
      ctx.lineWidth = Math.max(2.2, r * 0.2);
      ctx.beginPath(); ctx.moveTo(-r * 0.4, -r * 0.28); ctx.lineTo(r * 0.4, -r * 0.12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r * 0.4, 0.02); ctx.lineTo(r * 0.4, 0.02); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r * 0.4, r * 0.16); ctx.lineTo(r * 0.4, r * 0.32); ctx.stroke();
    } else {
      ctx.font = "700 " + Math.round(r * 1.05) + "px Georgia, serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("T", 0, 1);
    }
    ctx.restore();
  }

  const T_UI = {
    aiOn: "A.I. BUD ON", aiOff: "A.I. BUD OFF",
    dcaOn: "DCA ON", dcaOff: "DCA OFF",
    trendUp: "TREND ↑", trendDown: "TREND ↓", trendOff: "TREND OFF",
    buyBtc: "BUY BTC", sellBtc: "SELL BTC",
    keepPlaying: "KEEP PLAYING", playAgain: "PLAY AGAIN",
    options: "OPTIONS", paused: "PAUSED", resume: "RESUME", back: "BACK",
    sound: "SOUND", jukebox: "JUKEBOX", tutorial: "TUTORIAL", feedback: "FEEDBACK",
    language: "LANGUAGE", aiLog: "A.I. BUD LOG", signIn: "SIGN IN",
    ranked: "RANKED", training: "TRAINING", versus: "VERSUS",
    mpHost: "HOST ROOM", mpJoin: "JOIN", mpStart: "START MATCH", mpBack: "BACK",
    mpWait: "WAITING FOR PLAYERS", mpNeed: "Need 2+ players", mpCode: "ROOM",
    mpYouWin: "LAST ONE STANDING", mpWins: "WINS", mpDead: "ELIMINATED",
    mpNote: "Same candles. Last to die wins. Does not count for the board.",
    mpAlive: "ALIVE", mpCopy: "COPY CODE", mpCopied: "COPIED",
    mpReady: "I'M READY", mpUnready: "NOT READY", mpNeedReady: "Players must be ready",
    mpFull: "Room is full (8)", mpRules: "MATCH OPTIONS",
    mpCold0: "Starting cold", mpMsig0: "Starting multisig",
    mpMix: "Power-up mix (100)", mpBull: "Bull", mpBear: "Bear", mpLaserW: "Laser", mpSwanW: "Swan",
    mpColdW: "Cold", mpYou: "you",
    mpMixNeed: "Must total 100",
    mpMode: "Mode", mpLast: "Last man standing", mpWhale: "Whale", mpRace: "Race",
    mpRaceN: "Finish candle", mpBestOf: "Best of",
    mpSpec: "Spectating", mpRematch: "REMATCH", mpQuit: "QUIT",
    mpNext: "Next game", mpSeries: "Series", mpFinished: "FINISHED",
    mpNote: "Same candles. Last standing, whale, or race. Does not count for the board.",
    eloBoard: "VERSUS ELO", eloGuest: "Sign in to record ELO", eloUpdated: "ELO updated", eloPending: "ELO not saved",
    soundOn: "ON", soundOff: "OFF",
    bullSongs: "BULL/BEAR SONGS", gameFx: "GAME FX", voices: "VOICES",
    chanceHead: "ARC", chanceAck: "GOT IT", chanceTldr: "TLDR", chanceOutcome: "OUTCOME",
    arcCards: "ARC CARDS", arcTldrOn: "TLDR", arcFullOn: "FULL TEXT",
    howPlay: "HOW TO PLAY", market: "MARKETPLACE",
    runStats: "STATS", runChart: "CHART", runRecap: "RUN TAPE",
    graphics: "GRAPHICS",
    palClassic: "Classic", palMidnight: "Midnight", palTerminal: "Terminal",
    palPaper: "Paper", palNeon: "Neon", palSunset: "Sunset", palFlower: "Flower Power", palSimple: "Simple",
    animHero: "3D",
    hero2d: "2D",
    tapHero: "Tap the hero to switch 2D / 3D",
    tut1: "You are the ₿. Tap or press space to flap through the candle gaps. A wick liquidates you. The floor only counts when you fully leave the screen.",
    tut2: "Candles pay cash. Buy BTC on the dip, sell on the rip. Score is play-money net worth in BTC at the live in-game price.",
    tut3a: "Bull pumps price.",
    tut3b: "Bear dumps it.",
    tut4a: "Black swan is a black crash that dumps hard and stretches the bear.",
    tut4b: "Halving is a fat bull. It sits at the top or just above Buy/Sell.",
    tut5: "Cold storage saves a hit. Ten colds become one multisig life.",
    tut6: "Laser eyes eat a bear and unlock a perk.",
    tut7: "Ranked is 0 cold and 0 multisig and counts for the board. Training is 9 cold and 999 multisig and does not. Versus does not count for ranked scores or awards.",
    tut8: "Pick a perk and the menu vanishes like an Arc card — then tap ▶. DCA, A.I. bud, Jukebox, Marketplace and Arc sit on the HUD. Speed is the 1x button between Buy and Sell.",
    tut9: "Options → Graphics: pick a look, then tap the hero in the preview to switch 2D / 3D."
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
  const PERK_NAME = { dca: "DCA", ff: "FastForward", adopt: "Adoption", manip: "Manipulation", candy: "Candle candy", juke: "Jukebox", aibud: "A.I. bud", job: "Employment", market: "Marketplace", chance: "Arc", opsec: "Opsec" };
  const PERK_NAME_ES = { dca: "DCA", ff: "FastForward", adopt: "Adopción", manip: "Manipulación", candy: "Caramelo de vela", juke: "Jukebox", aibud: "A.I. bud", job: "Empleo", market: "Mercado", chance: "Arco", opsec: "Opsec" };
  const PERK_MAX = { dca: 1, ff: 3, adopt: 7, manip: 7, candy: 7, juke: 5, aibud: 6, job: 7, market: 1, chance: 7, opsec: 5 };
  const OPSEC_GIFT = [
    { cold: 1, msig: 0 },
    { cold: 2, msig: 0 },
    { cold: 3, msig: 0 },
    { cold: 0, msig: 1 },
    { cold: 0, msig: 2 }
  ];
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
      if (id === "candy") return candyLabel(tier) + (es ? " ingreso de velas" : " candle income");
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
      if (id === "opsec") {
        const g = OPSEC_GIFT[tier - 1] || OPSEC_GIFT[0];
        if (g.msig) return "+" + g.msig + " multisig";
        return "+" + g.cold + " cold storage";
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

  function packRunStats() {
    const st = Object.assign({}, S.stats || collectRunStats());
    const tape = S.runTape && S.runTape.length ? S.runTape : (S.tape || []);
    const maxN = 240;
    const n = tape.length;
    let packed = tape;
    let scale = 1;
    if (n > maxN) {
      packed = [];
      scale = (maxN - 1) / Math.max(1, n - 1);
      for (let i = 0; i < maxN; i++) packed.push(tape[Math.min(n - 1, Math.round(i / scale))]);
    }
    const remap = (arr) => (arr || []).map((m) => ({
      kind: m.kind, price: m.price, i: n > maxN ? Math.round((m.i || 0) * scale) : (m.i || 0)
    }));
    const packArr = (arr) => {
      const src = arr || [];
      if (n <= maxN) return src.slice();
      const out = [];
      for (let i = 0; i < maxN; i++) out.push(src[Math.min(src.length - 1, Math.round(i / scale))] || 0);
      return out;
    };
    st.tape = packed;
    st.marks = remap(S.runMarks);
    st.trades = remap(S.runTrades);
    st.tapeCash = packArr(S.runCash && S.runCash.length ? S.runCash : S.tapeCash);
    st.tapeBtc = packArr(S.runBtcBag && S.runBtcBag.length ? S.runBtcBag : S.tapeBtcBag);
    st.tapeNet = packArr(S.runNet && S.runNet.length ? S.runNet : S.tapeNet);
    return st;
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
    const stats = packRunStats();
    const old = s.scores.choppy3 || 0;
    const oldT = s.choppyTime != null ? s.choppyTime : 1e18;
    const better = n > old || (n === old && (stats.time || 0) < oldT);
    if (better) {
      s.scores.choppy3 = n;
      s.choppyTime = stats.time || 0;
      s.choppyStats = stats;
    }
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    if (typeof window.submitNewHighScore === "function") {
      window.submitNewHighScore(n, { lifeT: S.lifeT, candles: S.candles, human: !!S.humanInput, stats: stats });
    }
    return s.scores.choppy3;
  }

  function mulberry32(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function wrng() { return S.worldRand ? S.worldRand() : Math.random(); }

  function gauss(mean, lo, hi) {
    let u = 0, v = 0;
    while (!u) u = wrng();
    while (!v) v = wrng();
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
  function crashGuard() {
    const px = clampPx(S.price);
    if (px < 2500) return 4;
    if (px < 5000) return 3;
    if (px < 7500) return 2;
    if (px < 10000) return 1;
    return 0;
  }
  function crashScale(kind, dir) {
    const g = crashGuard();
    let k = 1;
    if (g > 0) {
      const down = dir < 0 || kind === "BEAR" || kind === "SWAN";
      if (down) k = Math.max(0.16, 1 - 0.21 * g);
    }
    if (kind === "SWAN") k *= 0.95;
    return k;
  }

  function pickCycleAmp(kind) {
    const t = S.have.adopt || 0;
    const soft = adoptSoft(t);
    let amp;
    if (kind === "HALVE") amp = 1 + (Math.random() * 0.2 - 0.1);
    else if (kind === "SWAN") amp = (0.75 + (Math.random() * 0.2 - 0.1)) * (1 - soft * 0.4) * 0.75;
    else if (kind === "BEAR") amp = (0.17 + Math.random() * 0.05) * (1 - soft * 0.45) * 0.9;
    else if (clampPx(S.price) < 10000) {
      const add = 2500 + Math.random() * 7500;
      amp = add / Math.max(PX_MIN, clampPx(S.price));
    }
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
      if (clampPx(S.price) < 10000) mag = amp * (1 - Math.random() * 0.15);
      else {
        const r = adoptBullRange(S.have.adopt || 0);
        mag = r.lo + Math.random() * (r.hi - r.lo);
      }
    } else {
      const r = adoptBearRange(S.have.adopt || 0);
      mag = Math.abs(r.lo + Math.random() * (r.hi - r.lo));
    }
    mag = Math.max(0.004, mag);
    if (kind === "BULL" && clampPx(S.price) < 10000) return mag;
    if (mag > amp * 0.92) mag = amp * 0.72;
    return mag;
  }

  function pickItem() {
    if (S.mp) {
      const r = S.mpRules || {};
      const w = [
        ["BULL", Math.max(0, Number(r.bull) || 0)],
        ["BEAR", Math.max(0, Number(r.bear) || 0)],
        ["LASER", Math.max(0, Number(r.laser) || 0)],
        ["SWAN", Math.max(0, Number(r.swan) || 0)],
        ["COLD", Math.max(0, Number(r.cold) || 0)]
      ];
      let tot = 0;
      w.forEach((x) => { tot += x[1]; });
      if (tot <= 0) return "BULL";
      let x = wrng() * tot;
      for (let i = 0; i < w.length; i++) {
        x -= w[i][1];
        if (x <= 0) {
          const type = w[i][0];
          if (type === "SWAN" && S.spawnedPipes < 7) return "BULL";
          return type;
        }
      }
      return "BULL";
    }
    const bag = ["BULL","BULL","BULL","BULL","BULL","BULL","BULL","BULL","BEAR","BEAR","BEAR","BEAR","BEAR","LASER","LASER","COLD","COLD","COLD","SWAN","SWAN","SWAN","SWAN"];
    let type = bag[(wrng() * bag.length) | 0];
    if (type === "SWAN" && S.spawnedPipes < 7) {
      const safe = bag.filter((t) => t !== "SWAN");
      type = safe[(wrng() * safe.length) | 0];
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
    tape: [], tapeVt: [], tapeCash: [], tapeBtcBag: [], tapeNet: [], tapeMarks: [], tapeTrades: [], eventPeaks: [], eventBottoms: [], waves: [], priceBase: 20000, drift: DRIFT0, level: 1, markAt: -99,
    startCash: 0, startPrice: 0, peakNet: 0, candles: 0, shownCandles: 0, buys: 0, sells: 0, swans: 0, lasers: 0,
    halvings: 0, halveLeft: HALVE_GAP, halveBull: false, halveFloor: 0, spawnedPipes: 0, halveSide: "up",
    swanBear: false, halveSpeechUntil: 0,
    stats: null, welcomed: false, introCounted: false, speechUntil: 0, speechRank: 0, humanInput: false, ranked: true,
    mp: false, worldSeed: 0, worldRand: null, mpOver: false, mpErr: "", mpJoinCode: "",
    mpRules: null, mpPlayAt: 0, mpSlot: 0, btcColdAt: 0, spectate: false, finished: false,
    mpRoundOver: false, mpSeriesOver: false, mpSeriesWins: {}, mpGameN: 1, mpNextAt: 0, mpRematchOn: false,
    jobTrack: null, jobOffer: null, jobName: "",
    have: { dca: 0, ff: 0, adopt: 0, manip: 0, candy: 0, juke: 0, aibud: 0, job: 0, market: 0, chance: 0, opsec: 0 },
    poolTier: { dca: 1, ff: 1, adopt: 1, manip: 1, candy: 1, juke: 1, aibud: 1, job: 1, market: 1, chance: 1, opsec: 1 },
    offerSeq: [1, 2], nextOffer: 1, offersDone: 0, perkResume: null, perkFib: 0,
    optPanel: null, optBack: "ready",
    sellsBear: 0, coldLost: 0, boughtBtc: false, halveMiss: 0, halveSpawned: 0,
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
  function btcRoom() { return Math.max(0, BTC_CAP - (S.btc || 0)); }
  function creditBtc(amount) {
    const want = Math.max(0, Number(amount) || 0);
    if (!want) return { take: 0, cash: 0 };
    const take = Math.min(want, btcRoom());
    const extra = want - take;
    S.btc = (S.btc || 0) + take;
    const cash = extra * clampPx(S.price);
    if (cash > 0) S.cash += cash;
    awardBtcColds();
    return { take, cash };
  }
  function awardBtcColds() {
    if (!S.mp) return;
    const u = Math.floor(S.btc || 0);
    const had = S.btcColdAt || 0;
    if (u > had) {
      S.cold = (S.cold || 0) + (u - had);
      S.btcColdAt = u;
      packCold();
    }
  }
  function clampHoldings() {
    if ((S.btc || 0) <= BTC_CAP) return;
    const extra = S.btc - BTC_CAP;
    S.btc = BTC_CAP;
    S.cash += extra * clampPx(S.price);
  }

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

  function candyMul(tier) {
    const t = Math.max(0, Number(tier != null ? tier : S.have.candy) || 0);
    if (t <= 0) return 1;
    return Math.pow((1 + Math.sqrt(5)) / 2, t);
  }
  function candyLabel(tier) {
    const m = candyMul(tier);
    const s = (Math.round(m * 100) / 100).toString();
    return s + "x";
  }

  function grantUsd(n, x, y, kind) {
    n = Number(n) || 0;
    if (!(n > 0)) return 0;
    if (kind === "gain" && S.have.candy > 0) n *= candyMul();
    const px = x == null ? S.bird.x : x;
    const py = y == null ? S.bird.y - 24 : y;
    if (S.dcaOn && S.have.dca > 0 && clampPx(S.price) > 0) {
      const price = clampPx(S.price);
      const want = n / price;
      const out = creditBtc(want);
      if (out.take > 0) pop(px, py, "+" + fmtAmt(out.take, "btc"), PAL.hud || BTC, kind);
      if (out.cash > 0) pop(px, py + (out.take > 0 ? 14 : 0), "+" + fmtAmt(out.cash, "usd"), PAL.labelUp || GREEN, kind);
      if (out.take <= 0 && out.cash <= 0) {
        S.cash += n;
        pop(px, py, "+" + n + " usd", GREEN, kind);
      }
    } else {
      S.cash += n;
      pop(px, py, "+" + n + " usd", GREEN, kind);
    }
    return n;
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

  function formatVoice(line) {
    let s = String(line || "").replace(/\s+/g, " ").trim();
    if (!s) return "";
    s = s.replace(/[.]+$/g, "");
    s = s.replace(/(^|[.!?]\s+)([a-záéíóúüñ])/g, (m, a, b) => a + b.toUpperCase());
    return s;
  }

  function voiceRank(kind) {
    if (kind === "halve") return 80;
    if (kind === "aibud") return 70;
    if (kind === "trade") return 10;
    if (kind === "cycle") return 20;
    return 40;
  }

  function say(line, urgent, kind) {
    if (!line) return;
    line = formatVoice(line);
    const rank = voiceRank(kind);
    const prev = S.speechRank || 0;
    const busy = S.lifeT < (S.speechUntil || 0);
    if (busy && rank <= prev) return;
    if (rank < 80 && S.lifeT < S.halveSpeechUntil) return;
    if (rank < 70 && S.lifeT < (S.aibudSpeechUntil || 0)) return;
    S.ticker = (window.BZ && BZ.lang && BZ.lang() === "es" && kind === "ui") ? line : line;
    S.tickerT = Math.max(1.5, lineDur(line));
    S.speechUntil = S.lifeT + lineDur(spoken(line));
    S.speechRank = rank;
    if (kind === "halve") S.halveSpeechUntil = S.speechUntil + 0.2;
    if (kind === "aibud") S.aibudSpeechUntil = S.speechUntil + 0.15;
    const cut = rank >= 70 || (busy && rank > prev);
    A.speak(spoken(line), !!(urgent && rank > 10) || cut);
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
    let line = bag[(Math.random() * bag.length) | 0];
    if (line === "Luke, I am your spammer" && Math.random() < 0.5) {
      const rest = bag.filter((l) => l !== "Luke, I am your spammer");
      line = rest[(Math.random() * rest.length) | 0] || "";
    }
    return line;
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

  function pipePw() {
    return metrics().pipeW * (S.widthMul || 1);
  }
  function pipeWx(p, pw) {
    const w = pw != null ? pw : pipePw();
    return p.x + w * 0.5;
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

  function pipeEndsRaw(p) {
    let top0 = p.gapY - p.gapH / 2;
    let bot0 = p.gapY + p.gapH / 2;
    if (S.power === "BEAR") {
      const cut = S.swanBear ? 0.045 : 0.025;
      top0 += p.gapH * cut;
      bot0 -= p.gapH * cut;
    }
    return { top: top0, bot: bot0 };
  }

  function wickAxis(p, r) {
    const pw = pipePw();
    const ends = pipeEndsRaw(p);
    const wick = Math.min(22, p.gapH * 0.14);
    const rad = r || 14;
    const lo = ends.top + rad;
    const hi = ends.bot - rad;
    return { x: pipeWx(p, pw), pw, lo, hi: Math.max(lo + 8, hi), wick, ends };
  }

  function itemsOnPipe(pipe) {
    return S.items.filter((it) => it.pipe === pipe);
  }

  function pinItem(it) {
    if (it.pipe && S.pipes.indexOf(it.pipe) >= 0) {
      const box = wickAxis(it.pipe, it.r);
      it.x = box.x;
      it.lo = box.lo;
      it.hi = box.hi;
      it.freeX = false;
    } else {
      it.pipe = null;
      it.freeX = true;
    }
    if (it.type === "HALVE") it.y = halveSlotY(it.halveUp, it.r);
    return true;
  }

  function spawnPipe(x) {
    const m = metrics();
    const gapH = m.gapH;
    const minY = m.margin + gapH / 2;
    const maxY = S.H - m.margin - gapH / 2;
    let gapY;
    if (!S.pipes.length) gapY = S.bird.y + (wrng() > 0.5 ? 1 : -1) * gapH * 0.28;
    else {
      const sign = wrng() > 0.5 ? 1 : -1;
      gapY = S.lastGapY + sign * (0.42 + wrng() * 0.42) * gapH;
    }
    gapY = Math.max(minY, Math.min(maxY, gapY));
    if (S.pipes.length && Math.abs(gapY - S.lastGapY) < gapH * 0.32) {
      gapY = S.lastGapY + (gapY >= S.lastGapY ? 1 : -1) * gapH * 0.4;
      gapY = Math.max(minY, Math.min(maxY, gapY));
    }
    S.lastGapY = gapY;
    S.spawnedPipes += 1;
    const raceN = S.mp ? ((S.mpRules && S.mpRules.mode === "race") ? (S.mpRules.raceN | 0) : 0) : 0;
    const isFinish = !!(raceN && S.spawnedPipes === raceN);
    const pipe = { x, gapY, gapH, green: wrng() > 0.45, scored: false, seen: false, finish: isFinish };
    S.pipes.push(pipe);
    if (!isFinish && wrng() < 0.52 && !itemsOnPipe(pipe).length) {
      const type = pickItem();
      const r = type === "SWAN" ? 17 : 14;
      const box = wickAxis(pipe, r);
      const span = Math.max(8, box.hi - box.lo);
      const y = box.lo + wrng() * span;
      S.items.push({
        pipe,
        x: box.x,
        y,
        lo: box.lo,
        hi: box.hi,
        vy: (wrng() < 0.5 ? -1 : 1) * (22 + wrng() * 16),
        type, r, freeX: false,
      });
    }
  }

  function tickHalve() {
    if(S.phase==="defense"){stepDefense(dt);return;}
    if (S.phase !== "play") return;
    if (S.halveLeft > 0) S.halveLeft -= 1;
    if (S.halveLeft === 4) {
      const pool = A.HALVE_SOON || ["Halving in sight!"];
      say(pool[(Math.random() * pool.length) | 0], true, "halve");
    }
    if (S.halveLeft === 2) {
      S.halveSide = wrng() < 0.5 ? "up" : "down";
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
    if (S.mp && S.worldSeed) S.worldRand = mulberry32(S.worldSeed);
    else S.worldRand = null;
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
      S.halvings = 0; S.halveMiss = 0; S.halveSpawned = 0; S.lasers = 0; S.perkPick = ""; S.perkHint = ""; S.dcaOn = false; S.trend = "off"; S.perkOffers = []; S.speedMul = 1;
      S.have = { dca: 0, ff: 0, adopt: 0, manip: 0, candy: 0, juke: 0, aibud: 0, job: 0, market: 0, chance: 0, opsec: 0 };
      S.poolTier = { dca: 1, ff: 1, adopt: 1, manip: 1, candy: 1, juke: 1, aibud: 1, job: 1, market: 1, chance: 1, opsec: 1 };
      S.offerSeq = S.ranked ? fibSeq(16) : [10, 20, 30];
      S.nextOffer = S.ranked ? 1 : 10;
      S.offersDone = 0;
      S.perkResume = null; S.perkFib = 0;
      S.jukeList = []; S.jukeUnlock = []; S.jukeTrack = 0; S.jukeOn = false; S.jukeShuffle = false; S.jukeRepeat = "off"; S.jukeOff = {};
      S.aibudOn = false; S.aibudLit = {}; S.aibudLitAt = {}; S.iaLog = []; S.iaProfit = 0; S.aibudSpeechUntil = 0; S.aiAcc = 0; S.aiTimingStart = null; S.aiTimingLast = 0; S.aiTradeAt = -999;
      S.jobName = ""; S.jobTrack = null; S.jobOffer = null; S.chanceAt = []; S.chanceUntil = 0; S.chanceUsed = {}; S.chanceCard = null; S.chanceNote = ""; S.chanceReadyNote = ""; S.chanceSettled = false; S.chanceMet = {}; S.chanceLead = ""; S.arcHold = false; S.arcTldr = ""; S.arcPending = null; S.hasRing=false; S.familyClosed=false; S.familyPath=false; S.bcBook=false; S.bcIslandOffer=0; S.bcIsland=false; S.bcOg=false; S.bcNodes=0; S.bcNodeTick=0; S.bcSettlement=false; S.bcPower=false; S.bcMine=false; S.bcCitadel=false; S.bcArmyUnlocked=false; S.bcArmy=0; S.bcWorld=20; S.bcIndependent=false; S.bcArcClosed=false; S.bcDefense=null; S.bcArmySpend=0;
      if (A && A.jukeStop) A.jukeStop();
    }
    S.halveLeft = HALVE_GAP; S.halveBull = false; S.halveFloor = 0; S.spawnedPipes = 0; S.halveSide = "up";
    S.shownCandles = 0;
    S.swanBear = false; S.halveSpeechUntil = 0;
    S.cold = S.ranked ? 0 : 9;
    S.invuln = 0;
    if (!keepWallet) S.msig = S.ranked ? 0 : 999;
    if (S.mp) {
      const r = S.mpRules || (window.ChoppyMP && window.ChoppyMP.rules && window.ChoppyMP.rules()) || {};
      S.cold = (r.startCold | 0) || 0;
      if (!keepWallet) S.msig = 0;
      S.btcColdAt = 0;
    }
    S.power = "NONE"; S.powerT = 0;
    applyLaser(false);
    S.widthMul = S.heightMul = 1;
    S.bg = 0; S.ticker = ""; S.tickerT = 0;
    S.lastGapY = S.bird.y; S.dead = false;
    S.cycleStart = S.price; S.cycleDur = POWER_S; S.cycleElapsed = 0;
    S.cycleAmp = 0;
    S.cycleMax = S.price; S.cycleMin = S.price; S.cycleMaxI = 0; S.cycleMinI = 0;
    S.lifeT = 0; S.sampleAcc = 0; S.tape = []; S.tapeVt = []; S.tapeCash = []; S.tapeBtcBag = []; S.tapeNet = []; S.tapeLo = null; S.tapeHi = null;
    S._tapeVis = null; S._tvN = -1; S._tvStart = -1; S._tapeT = 0;
    S.tapeMarks = []; S.tapeTrades = []; S.eventPeaks = []; S.eventBottoms = []; S.tapeLive = null;
    S.markAt = -99;
    S.cycleEnv = 0; S.cycleManip = 1; S.cycleStacks = 0;
    S.waves = []; S.priceBase = clampPx(S.price);
    S.drift = DRIFT0 * (1 + (wrng() * 2 - 1));
    S.runTab = null; S.runTape = []; S.runMarks = []; S.runTrades = []; S.runCash = []; S.runBtcBag = []; S.runNet = []; S.chartFlags = { trades: false, btc: false, usd: false, net: false };
    S.speechUntil = 0;
    S.speechRank = 0;
    const first = S.bird.x + 210;
    spawnPipe(first); spawnPipe(first + m.spacing); spawnPipe(first + m.spacing * 2);
    S.spawnX = first + m.spacing * 2;
  }

  function sameDirN(w) {
    const waves = S.waves || [];
    const idx = waves.indexOf(w);
    if (idx < 0) return 1;
    let n = 0;
    for (let i = 0; i <= idx; i++) if (waves[i].dir === w.dir) n++;
    return Math.max(1, n);
  }
  function stackW(w) {
    return 1 / sameDirN(w);
  }
  function waveMul(sum) {
    return Math.max(0.18, Math.min(3.2, 1 + sum));
  }

  function waveDur() { return WAVE_UP + WAVE_BACK; }
  function waveAge(w, now) { return (now != null ? now : S.lifeT) - w.t0; }
  function waveLive(w, now) { return waveAge(w, now) < waveDur(); }
  function liveWaves(now) { return (S.waves || []).filter((w) => waveLive(w, now)); }

  function waveK(w, now) {
    const t = waveAge(w, now);
    if (t <= 0) return 0;
    const dir = w.dir;
    const k = crashScale(w.kind, dir) * stackW(w);
    if (t <= WAVE_UP) {
      const u = Math.min(1, t / WAVE_UP);
      const e = u * u * (3 - 2 * u);
      return dir * w.amp * e * k;
    }
    if (t < waveDur()) {
      const u = Math.min(1, (t - WAVE_UP) / WAVE_BACK);
      const e = u * u * (3 - 2 * u);
      return dir * (w.amp + (w.resid - w.amp) * e) * k;
    }
    return dir * w.resid * k;
  }

  function syncWaveFlags() {
    const now = S.lifeT;
    const live = liveWaves(now);
    S.halveBull = live.some((w) => w.kind === "HALVE");
    S.swanBear = live.some((w) => w.kind === "SWAN");
    S.cycleStacks = (S.waves || []).length;
    let left = 0;
    for (const w of live) left = Math.max(left, w.t0 + waveDur() - now);
    S.powerT = Math.max(0, left);
    const last = live.length ? live[live.length - 1] : null;
    S.power = last ? last.type : ((S.waves || []).length ? S.power : "NONE");
    if (!live.length && !(S.waves || []).length) { S.power = "NONE"; S.powerT = 0; }
  }

  function beginCycle(type, kind) {
    const k = kind || type;
    const dir = type === "BULL" ? 1 : -1;
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
      S.waves = [];
    }
    S.waves.push({ type: type, kind: k, dir: dir, amp: amp, resid: resid, t0: S.lifeT, marked: false });
    S.power = type;
    S.tapeLive = { kind: dir > 0 ? "peak" : "bottom", price: S.price, i: S.tape.length };
    if (k === "HALVE") S.halveBull = true;
    if (k === "SWAN") S.swanBear = true;
    syncWaveFlags();
    kickTheme();
  }

  function endCycle() {
    if (!(S.waves && S.waves.length)) return;
    let sum = 0;
    for (const w of S.waves) sum += w.dir * w.resid * crashScale(w.kind, w.dir) * stackW(w);
    let next = (S.priceBase || S.price) * waveMul(sum) * (S.cycleManip || 1);
    if (S.halveFloor > 0 && S.waves.some((w) => w.kind === "HALVE")) next = Math.max(next, S.halveFloor);
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

  function stampWaveMark(w) {
    if (!w || w.marked) return;
    if ((S.lifeT - (S.markAt || -99)) < 3) { w.marked = true; return; }
    w.marked = true;
    if (!S.tapeMarks) S.tapeMarks = [];
    S.tapeMarks.push({
      kind: w.dir > 0 ? "peak" : "bottom",
      price: S.price,
      i: S.tape.length
    });
    S.markAt = S.lifeT;
    if (S.tapeMarks.length > 36) S.tapeMarks = S.tapeMarks.slice(-36);
  }

  function updateTapeLive(now) {
    let follow = null;
    for (const w of (S.waves || [])) {
      const t = waveAge(w, now);
      if (t >= WAVE_UP) stampWaveMark(w);
      else if (t >= 0) follow = w;
    }
    if (follow) {
      S.tapeLive = { kind: follow.dir > 0 ? "peak" : "bottom", price: S.price, i: S.tape.length };
    } else {
      S.tapeLive = null;
    }
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
    const base = (S.drift != null ? S.drift : DRIFT0);
    let bias = base * (1 + (Math.random() * 2 - 1) * 0.05);
    if ((S.have.manip || 0) > 0) {
      const k = (S.have.manip || 0) * (12 / 7);
      if (S.trend === "up") bias += 0.004 * k;
      else if (S.trend === "down") bias -= 0.004 * k;
    }
    return bias;
  }

  function fibAt(n) {
    const i = Math.max(1, n | 0);
    const s = fibSeq(Math.max(2, i));
    return s[i - 1] || 1;
  }

  function halveSlotY(up, r) {
    const rad = r || 17;
    const pad = rad + 10;
    if (up) return pad;
    const buy = $("buy-btc");
    const c = $("c");
    if (buy && c) {
      const cb = c.getBoundingClientRect();
      const bb = buy.getBoundingClientRect();
      const scale = S.H / Math.max(1, cb.height);
      const y = (bb.top - cb.top) * scale - pad;
      if (isFinite(y)) return Math.max(pad, Math.min(S.H - pad, y));
    }
    return S.H - 78;
  }

  function spawnHalve() {
    if (S.items.some((it) => it.type === "HALVE")) return;
    let pipe = null;
    for (let i = S.pipes.length - 1; i >= 0; i--) {
      if (!itemsOnPipe(S.pipes[i]).length) { pipe = S.pipes[i]; break; }
    }
    const r = 17;
    const up = S.halveSide !== "down";
    const y = halveSlotY(up, r);
    if (pipe) {
      const box = wickAxis(pipe, r);
      S.items.push({
        pipe, x: box.x, y, lo: box.lo, hi: box.hi,
        type: "HALVE", r, halveUp: up, freeX: false
      });
    } else {
      S.items.push({
        pipe: null, x: S.W + 56, y, lo: y, hi: y,
        type: "HALVE", r, halveUp: up, freeX: true
      });
    }
    S.drift = (S.drift != null ? S.drift : DRIFT0) * DRIFT_GROW;
    S.halveSpawned = (S.halveSpawned || 0) + 1;
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
      if (line) say(line, true, "cycle");
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
      packCold();
      if (S.cold === 0) {
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
      const gift = fibAt(S.halvings);
      const out = creditBtc(gift);
      if (out.take > 0) pop(it.x, it.y - 36, "+" + fmtAmt(out.take, "btc"), BTC, "power");
      if (out.cash > 0) pop(it.x, it.y - 50, "+" + fmtAmt(out.cash, "usd"), GREEN, "power");
      const floorFrom = S.power === "BULL" ? (S.priceBase || S.price) : S.price;
      S.halveFloor = Math.max(S.halveFloor, floorFrom + halveMinRise());
      beginCycle("BULL", "HALVE");
      say("Halving number " + S.halvings, true, "halve");
      A.sfx.cap();
      return;
    }
    beginCycle(it.type);
    const line = drawLine(it.type === "BULL" ? A.BULL : A.BEAR, 0.15);
    if (line) say(line, true, "cycle");
    if (it.type === "BULL") A.sfx.wave();
    else A.sfx.hit();
  }

  function hitFatal() {
    if (S.spectate || S.finished) return;
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
    try { if (A && A.speak) A.speak(formatVoice("Rekt! You got liquidated"), true); } catch (e) {}
    S.ticker = t("liquidated");
    if (!S.mp) {
      try { S.best = saveBest(scoreSats()); } catch (e) {}
      snapshotRun();
    }
    if (field) field.classList.remove("is-play");
    if (S.mp && window.ChoppyMP) {
      try { snapshotRun(); } catch (e) {}
      try { window.ChoppyMP.dead(S.lifeT, S.candles, { btc: S.btc }); } catch (e) {}
      S.spectate = true;
      if (field) field.classList.add("is-play");
      S.phase = "play";
      renderHud();
      renderOverlay();
      return;
    }
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
    if (S.phase !== "play" || S.dead || S.spectate || S.finished) return;
    const m = metrics();
    S.bird.v = m.jump || -280;
    try { if (A && A.sfx && A.sfx.jump) A.sfx.jump(); } catch (e) {}
  }
  function buyBtc() {
    if (S.phase !== "play" || S.cash <= 0 || clampPx(S.price) <= 0 || S.spectate || S.dead || S.finished) return;
    const px = clampPx(S.price);
    const room = btcRoom();
    if (room <= 0) return;
    const spent = Math.min(S.cash, room * px);
    if (spent <= 0) return;
    const got = spent / px;
    creditBtc(got);
    S.cash -= spent;
    S.buys++; S.boughtBtc = true; A.sfx.buy();
    if (!S.aiSilent) {
      const buyLine = drawLine(A.BUY, 0.3);
      if (buyLine) say(buyLine, false, "trade");
      if (S.aibudLit) { S.aibudLit.buy = false; S.aibudLit.sell = false; }
    }
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(got, "btc"), BTC, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(spent, "usd"), RED, "trade");
    markTrade("buy");
  }
  function sellBtc() {
    if (S.phase !== "play" || S.btc <= 0 || S.spectate || S.dead || S.finished) return;
    const btc = S.btc, usd = btc * S.price;
    S.cash += usd; S.btc = 0; S.sells++;
    if (S.power === "BEAR" || S.swanBear) S.sellsBear = (S.sellsBear || 0) + 1; A.sfx.sell();
    if (!S.aiSilent) {
      const sellLine = drawLine(A.SELL, 0.3);
      if (sellLine) say(sellLine, false, "trade");
      if (S.aibudLit) { S.aibudLit.buy = false; S.aibudLit.sell = false; }
    }
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(usd, "usd"), GREEN, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(btc, "btc"), RED, "trade");
    markTrade("sell");
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
    if (sellLine) say(sellLine, false, "trade");
    pop(S.bird.x + 28, S.bird.y - 12, "+" + fmtAmt(usd, "usd"), GREEN, "trade");
    pop(S.bird.x + 28, S.bird.y + 8, "-" + fmtAmt(vt, "vt"), RED, "trade");
  }
  function togglePause() {
    if (S.mp) return;
    if (S.phase === "chance") return;
    if (S.phase === "perk") {
      if (S.perkPick) confirmPerk();
      return;
    }
    if (S.phase === "play") { S.optBack = "play"; S.optPanel = null; S.arcHold = false; setPhase("paused"); }
    else if (S.phase === "paused") {
      S.optPanel = null;
      S.arcHold = false;
      setPhase(S.optBack || "play");
    }
  }

  function markTrade(kind) {
    if (!S.tapeTrades) S.tapeTrades = [];
    S.tapeTrades.push({ i: (S.tape || []).length, kind, price: clampPx(S.price) });
  }
  function pickPerk(kind) {
    S.perkPick = kind;
    confirmPerk();
  }

  function confirmPerk() {
    if (S.phase !== "perk" || !S.perkPick) return;
    grantPerk(S.perkPick);
    S.perkPick = "";
    S.perkOffers = [];
    bumpOffer();
    S.perkResume = null;
    S.optPanel = null;
    S.optBack = "play";
    S.arcHold = true;
    setPhase("paused");
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
    if (kind === "opsec") applyOpsec(S.have.opsec);
  }

  function packCold() {
    while ((S.cold || 0) >= 10) {
      S.cold -= 10;
      S.msig = (S.msig || 0) + 1;
    }
  }

  function applyOpsec(tier) {
    const g = OPSEC_GIFT[Math.max(0, (tier || 1) - 1)] || OPSEC_GIFT[0];
    if (g.cold) S.cold = (S.cold || 0) + g.cold;
    if (g.msig) S.msig = (S.msig || 0) + g.msig;
    packCold();
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
  function takeCash(n) {\n    const got = Math.min(S.cash, Math.max(0, n)); S.cash -= got; return got;\n  }\n  function takeUsdEquivalent(n) {
    const got = Math.min(S.cash, Math.max(0, n));
    S.cash -= got;
    return got;
  }
  function takeUsdEquivalent(n) {
    let need=Math.max(0,Number(n)||0), paid=0;
    const cash=Math.min(Math.max(0,S.cash||0),need); S.cash-=cash; need-=cash; paid+=cash;
    const px=clampPx(S.price);
    if(need>0&&px>0&&S.btc>0){const b=Math.min(S.btc,need/px);S.btc-=b;need-=b*px;paid+=b*px;}
    return paid;
  }
  function grantWealthPct(p) {
    const n = wealthUsd() * Math.max(0, p);
    if (n > 0) grantUsd(n, S.bird.x, S.bird.y - 24, "arc");
    return n;
  }
  function arcPay(n) {
    if (n > 0) grantUsd(n, S.bird.x, S.bird.y - 24, "arc");
  }
  function cutPct(p) {
    return takeWealthPct(p);
  }
  function cutBill(usd) {
    return takeUsdEquivalent(usd);
  }
  function arcOptionLabel(card,o,es){
    let lab=es?(o.labelEs||o.label):o.label;
    const pct={ring:{a:.08,b:.03},wedding:{a:.12,b:.05,c:.01},honeymoon:{a:.10,b:.04},baby:{a:.05,b:.02},peopleAsking:{a:.03},extensionCord:{a:.04},obviously:{a:.05},protectIsland:{a:.02},citadelQuestion:{a:.08}};
    const p=pct[card.id]&&pct[card.id][o.k];
    if(p!=null){const cost=wealthUsd()*p;lab=lab.replace(/\s*·?\s*\d+(?:\.\d+)?%\s*(?:net worth)?/gi,"").trim()+" · "+money(cost);}
    return lab;
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
  const CHANCE_TLDR = {
    justInCase:{en:"A temporary emergency law expands government powers during economic instability. You read the definition twice. It seems to include most years."},
    nothingToHide:{en:"An optional digital ID makes airports faster, then becomes required for more services. You have nothing to hide. The question still bothers you."},
    somethingBetter:{en:"Running a wooded coastal trail with Marek, you say that given enough money you could build something better. Not a company. Not a charity. You do not yet know what."},
    timeTraveler:{en:"An old Bitcoin forum post claims to be from the future: rich holders live in isolated Citadels. What bothers you is that they stopped trying to fix the places they lived in. THE BITCOIN STATE — $666."},
    temporaryMeasures:{en:"Capital controls arrive for ninety days. The previous temporary measures are entering their fourth year. Markets fall. Bitcoin does not."},
    citadelProblem:{en:"The book uses sovereignty 186 times. Running with Marek, you propose a country. No way. Twenty minutes later he asks how much land you need. A stupid idea now has a checklist."},
    pieceWorld:{en:"Nico finds an isolated island listing with two coves, a bad dock, and a UNIQUE SOVEREIGN LIFESTYLE OPPORTUNITY. It is not sovereign. You check. Three times."},
    islandInspection:{en:"The island is beautiful: pine, cliffs, coves, open water. Marek says No way and means it positively. The seller offer is fixed at 10–25% of your net worth at inspection."},
    paperwork:{en:"Lawyers redefine property for weeks. Nico signs in the wrong place. Paco eats the corner of the final document. Country, Nico says. Still an island. For now."},
    nobodyKnows:{en:"No citizens. No recognition. An old contact gives you one name: MADAME LUCK. Marek says No way. Nico says he knows her. Of course he does."},
    theOg:{en:"Madame Luck joins seventeen minutes late, asks very good questions, then says she will tell some people. Your phone starts vibrating. LIBERTY NODES UNLOCKED."},
    peopleAsking:{en:"At 10 Liberty Nodes, developers, miners and families ask to move in. Nico makes a spreadsheet. Marek finds the problem: We do not have houses."},
    extensionCord:{en:"Residents bring refrigerators, computers, pumps, servers and a sauna nobody admits owning. At 8:43 P.M. the island goes dark. WHO WAS MINING?"},
    obviously:{en:"The grid works. Nico says you should mine Bitcoin. Obviously. One proposal says only: CHEAP POWER. WE MINE. YOU GET BITCOIN."},
    principality:{en:"Mr Ortega & Gambette, Foreign Minister of Saint Arnald, wants relations. Saint Arnald has a flag, anthem, website and 614 claimed citizens."},
    stateVisit:{en:"Saint Arnald has a coastal town, hills, and a government building that may or may not have been a restaurant three months ago. They want Bitcoin infrastructure. You want friends."},
    firstBloc:{en:"Seven countries form the Bloc: trade, energy, currency coordination, defense, joint exercises. Every speaker uses the word stability."},
    protectIsland:{en:"Someone steals a boat. Your current security system is one camera and Paco. Paco was asleep."},
    placeNow:{en:"At 50 Nodes, coffee shops, a bakery, a bar and a newspaper appear. Its first editorial criticizes you. Nico says you have made it: you have opposition."},
    citadelQuestion:{en:"Marek brings plans for walls, protected power and a hardened center. Citadel. A wall can keep people out. It can also keep people safe."},
    rearmament:{en:"The Bloc announces more ships, aircraft and bases. A rival group does the same. Nobody appears to be improving global security."},
    anOffer:{en:"A private group offers +35% net worth for everything. Madame Luck asks one question: Why did you build it?"},
    ambassador:{en:"At 75 Nodes, a real ambassador visits. Before leaving: If you ever decide to do something stupid, call me first."},
    threeColors:{en:"Three military colors cover most of the world. Saint Arnald is gray. Nobody seems to know what to do with Saint Arnald."},
    ortegaCalls:{en:"Saint Arnald offers forty-two years of recognition experience. Mostly they learned what not to do."},
    theQuestion:{en:"100 Liberty Nodes. The project can now become a declaration. Army strength is your choice; independence does not require 100 Army."},
    declaration:{en:"You sign. Thirty-seven seconds later Saint Arnald recognizes Bitcoin Country. Marek checks his phone. Of course they did."},
    theAnswer:{en:"Recognition is not universal. One of the blocs responds with force. The declaration now has to survive."},
    fourthColor:{en:"The attack fails. Bitcoin Country remains independent. Some governments begin negotiations; Saint Arnald never stopped calling it a country."},
    notYet:{en:"The defense fails. The island, residents and project survive, but the declaration does not. You can prepare and try again later."},
    landfill: { en: "Nico is in Wales at 1:14 A.M. digging Docksway for a lost 8,000 BTC USB. He wants a partner, not a spectator. Almost always you find nothing.", es: "Nico está en Gales a la 1:14 excavando Docksway por un USB de 8.000 BTC. Quiere un socio, no un espectador. Casi nunca aparece nada." },
    taxbill: { en: "Your quarterly tax bill arrives. You reopen it in case the number changed. It did not. Cost: 10% of net worth.", es: "Llega la boleta trimestral. La volvés a abrir por si cambió el número. No cambió. Costo: 10% del patrimonio." },
    nicoWedding: { en: "Nico's wedding: 400 people, twelve you know, 1998 CDs. Lena says don't let him talk you into anything. A generous envelope may come back as cold storage.", es: "Boda de Nico: 400 personas, doce conocidas, CDs del 98. Lena: que no te convenza de nada. Un sobre generoso puede volver como cold storage." },
    mexico: { en: "Lena wants five days in Tulum. You think three. Paco ate the brochure. The trip buys a few seconds of feeling untouchable.", es: "Lena quiere cinco días en Tulum. Vos pensás tres. Paco se comió el folleto. El viaje compra unos segundos de sentirte intocable." },
    flu: { en: "Lena has the flu. Soup, medicine, Paco eats half. About $120 you will not get back.", es: "A Lena le da gripe. Sopa, remedio, Paco se come la mitad. Unos $120 que no vuelven." },
    phish: { en: "A fake support email wants your seed phrase. The site looks convincing. Falling for it can cost about 18% of net.", es: "Un mail falso de soporte pide tu seed. El sitio se ve convincente. Caer puede costar cerca del 18% del patrimonio." },
    crash: { en: "A scooter taps the bumper. Nobody is hurt. The bumper still costs about $650.", es: "Un scooter toca el paragolpes. Nadie se lastimó. El paragolpes igual sale unos $650." },
    wine: { en: "Friday at Marek's: wine, 12 Monkeys paused, A.I. debate. You're the enthusiastic one. Neither of you wins.", es: "Viernes en casa de Marek: vino, 12 Monkeys en pausa, debate de I.A. Vos sos el entusiasta. No gana nadie." },
    casino: { en: "Nico calls at 11:40 P.M. He found a casino table. You should ask more questions. The table may or may not know you.", es: "Nico llama a las 23:40. Encontró una mesa de casino. Deberías preguntar más. La mesa puede no conocerte." },
    poker: { en: "Marek's private game. Not a casino. Wine, chips, late. He looks at your stack and asks if you're in.", es: "El póker de Marek. No es un casino. Vino, fichas, tarde. Mira tus fichas y pregunta si jugás." },
    uncle: { en: "Uncle Héctor sent ~7% of net as cash or sats. He will not say why.", es: "El tío Héctor mandó ~7% del patrimonio en cash o sats. No dice por qué." },
    school: { en: "Sofi's mint-museum trip. They're short this month. Lena thinks you should help. Covering it is about $300.", es: "Viaje de Sofi al museo de la Casa de Moneda. Este mes están justos. Lena cree que deberías ayudar. Cubrirlo sale unos $300." },
    roof: { en: "Paco found the leak by sitting under it. The roof repair is about $900.", es: "Paco encontró la gotera sentándose debajo. Arreglar el techo sale unos $900." },
    lotto: { en: "Marek sets up Levitsky–Marshall, 1912. Black to move. Find Marshall’s legendary move: choose a piece and destination square.", es: "Marek arma Levitsky–Marshall, 1912. Juegan negras. Encontrá la jugada legendaria de Marshall: elegí pieza y casilla." },
    hospital: { en: "Four stitches. Lena drives. About $250. Try not to bleed on anything.", es: "Cuatro puntos. Lena maneja. Unos $250. Tratá de no sangrar sobre nada." },
    startup: { en: "Nico's 47-slide app: subscriptions, A.I., community ownership. He says the upside is massive. It might 4×. It might be a dead domain.", es: "La app de Nico, 47 slides: suscripciones, I.A., community ownership. Dice que el upside es enorme. Puede hacer 4×. O ser un dominio vencido." },
    tow: { en: "Wrong spot for nine minutes. The sign was clear. About $85.", es: "Mal estacionado nueve minutos. El cartel era claro. Unos $85." },
    courage: { en: "Wine at Marek's. He says maybe you're waiting for certainty with Lena. Then he presses play again.", es: "Vino en casa de Marek. Dice que capaz estás esperando certeza con Lena. Después le da play de nuevo." },
    ring: { en: "Jewelry store. You know why you're there. The only question is how responsible you want to look.", es: "Joyería. Sabés por qué estás ahí. La única duda es cuán responsable querés parecer." },
    date: { en: "A proper date: restaurant, walk, lake at sunset. Nothing goes wrong. That feels suspicious.", es: "Una cita en forma: restorán, caminata, lago al atardecer. No pasa nada malo. Eso se siente raro." },
    proposal: { en: "The lake is getting dark. The ring is in your pocket. This is the moment.", es: "El lago se oscurece. El anillo está en el bolsillo. Este es el momento." },
    wedding: { en: "You and Lena are getting married. Invitations, relatives, flowers. Most of her opinions win.", es: "Se casan con Lena. Invitaciones, parientes, flores. Ganan casi todas las opiniones de ella." },
    honeymoon: { en: "Lena took your phone. The rule is no checking the portfolio. You immediately wonder whether looking at the total counts.", es: "Lena te sacó el teléfono. La regla es no mirar el portfolio. Enseguida te preguntás si mirar el total cuenta." },
    pregnancy: { en: "Two lines. You're going to be four. First bills: $450.", es: "Dos rayas. Van a ser cuatro. Primeros gastos: $450." },
    baby: { en: "The baby is here. Everyone is tired. Paco is confused. Kids grow fast.", es: "Llegó el bebé. Todos cansados. Paco no entiende. Los chicos crecen rápido." },
    cousin: { en: "Nico's new token. 10× by Friday, he says. You ask what it does. That is \"not the important part.\"", es: "El token de Nico. x10 para el viernes, dice. Preguntás qué hace. Esa \"no es la parte importante.\"" },
    speeding: { en: "Six over. Same corner. Same officer. About $75.", es: "Diez de más. La misma esquina. El mismo oficial. Unos $75." },
    wallet: { en: "You leave your wallet on the bus. Someone turns it in three stops later. The cash is gone; the cards are still there. Partial victory. About $40 lost.", es: "Dejás la billetera en el bondi. Alguien la entrega tres paradas después. Falta el efectivo; las tarjetas siguen ahí. Victoria parcial. Unos $40 perdidos." },
    potluck: { en: "Lena signed you up for a neighborhood potluck. She also signed Paco. He already ate the dish.", es: "Lena los anotó en la olla de la cuadra. También anotó a Paco. Ya se comió el plato." },
    usedcar: { en: "Nico's 2009 Fit. The seller says new timing belt. Nico looks under the hood: Sharpie. He says that means \"basically new.\"", es: "El Fit 2009 de Nico. El vendedor dice correa nueva. Nico mira: Sharpie. Dice que significa \"casi nuevo.\"" },
    tetris: { en: "Marek, a bar, a Tetris cabinet nobody uses. He gets unusually focused, then steps aside. Your turn.", es: "Marek, un bar, un Tetris que nadie usa. Se concentra de un modo raro y se corre. Tu turno." },
    unclemike: { en: "Fancy dinner. Uncle Mike studies the tip line, puts the pen down, and rants about tipping culture. The waiter is still standing there.", es: "Cena cara. El tío Mike mira la línea de propina, deja la birome y se desahoga con la cultura de las tips. El mozo sigue ahí." }
  };
  function cardTldr(card) {
    if (!card) return "";
    const row = CHANCE_TLDR[card.id];
    if (!row) return "";
    return chanceLang() ? (row.es || row.en) : row.en;
  }
  function bodyIsLong(text) {
    const s = String(text || "");
    return s.length >= 220 || s.split(/\n+/).filter(Boolean).length >= 4;
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
    { id: "lotto", kind: "chess", after: ["wine"],
      title: "The Gold Coins Move", titleEs: "La jugada de las monedas de oro",
      body: "Marek sets up a position from Levitsky–Marshall, Breslau 1912. Black to move. Marshall found a queen move so absurd that the story says spectators threw gold coins onto the board. Marek does not tell you whether the coins part is true. “Forget the legend. Find the move.” Choose the piece and destination square.",
      bodyEs: "Marek arma una posición de Levitsky–Marshall, Breslau 1912. Juegan negras. Marshall encontró una jugada de dama tan absurda que la historia dice que los espectadores tiraron monedas de oro al tablero. Marek no te dice si esa parte es cierta. “Olvidate de la leyenda. Encontrá la jugada.” Elegí pieza y casilla." },
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
    { id: "courage", kind: "choice", after: ["landfill","nicoWedding","mexico","flu","school","hospital","potluck","wine","justInCase","nothingToHide"],
      title: "Courage", titleEs: "Coraje",
      body: "You are at Marek's apartment. There is wine on the table and 12 Monkeys paused on the TV. You end up talking about A.I., futurism, and whether people actually know what they want. Eventually you mention Lena. Marek looks at you. \"So?\" You shrug. \"We've been together for years.\" He takes a sip. \"Maybe you're waiting for certainty.\" Then he presses play again. You keep thinking about it.",
      bodyEs: "Estás en el depto de Marek. Hay vino en la mesa y 12 Monkeys en pausa. Terminan hablando de I.A., futurismo y si la gente sabe lo que quiere. En algún momento nombrás a Lena. Marek te mira. \"¿Y?\" Te encogés de hombros. \"Hace años que estamos.\" Toma un sorbo. \"Capaz estás esperando certeza.\" Vuelve a darle play. Segís pensándolo.",
      opts: [
        { k: "a", label: "Buy the ring · 6%", labelEs: "Comprar el anillo · 6%" },
        { k: "b", label: "Wait", labelEs: "Esperar" }
      ] },
    { id: "ring", kind: "choice", after: ["courage"], when:()=>!!S.hasRing,
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
        { k: "c", label: "Run · 1%", labelEs: "Run · 1%" }
      ] },
    { id: "honeymoon", kind: "choice", after: ["wedding"], when:()=>!!S.familyPath&&!S.familyClosed,
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
      title: "Found It", titleEs: "La encontraron",
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
,
    { id:"justInCase", kind:"report", title:"Just in Case", body:"A new emergency law passes after three days of debate. It gives government broader powers during economic instability. Temporary. You read the definition twice. It seems to include most years." },
    { id:"nothingToHide", kind:"report", after:["justInCase"], title:"Nothing to Hide", body:"A new digital ID rolls out as optional. Airports get faster. Banks offer discounts. Government services begin moving to it. A TV host asks: “If you've got nothing to hide, what's the problem?” You have nothing to hide. The question still bothers you." },
    { id:"somethingBetter", kind:"report", after:["nothingToHide","wine"], title:"Something Better", body:"You are running with Marek along a wooded coastal trail. The sea appears between the trees. “Given enough money,” you say, “you could actually build something better.” Marek looks over. “A company?” “No.” “A charity?” “No.” You do not yet know what." },
    { id:"timeTraveler", kind:"choice", after:["wedding"], when:()=>!!S.familyClosed, title:"The Time Traveler", body:"Late at night you find an old Bitcoin forum post. The author claims to be writing from the future. Bitcoin is enormous. Governments are weaker. Rich holders live in Citadels that began as mining compounds, then fortified communities, then something else. What bothers you is not the walls. It is that they stopped trying to fix the places they lived in. A search leads to a book: THE BITCOIN STATE — $666. It looks self-published.", opts:[{k:"a",label:"Buy the book · $666"},{k:"b",label:"Close the browser"}] },
    { id:"temporaryMeasures", kind:"report", after:["wedding"], when:()=>!!S.familyClosed, title:"Temporary Measures", body:"A financial emergency is declared. Transfer restrictions arrive. Cash limits follow. Several payment apps stop working. Officials say the measures will last ninety days. The previous temporary measures are entering their fourth year. Markets fall. Bitcoin does not." },
    { id:"citadelProblem", kind:"report", after:["timeTraveler","temporaryMeasures"], when:()=>!!S.bcBook&&!!S.familyClosed, title:"The Citadel Problem", body:"The book arrives. Four hundred and seventeen pages. It uses the word sovereignty 186 times. You send Marek several questionable pages. “No way.” Later, running the coastal trail, you say it anyway. “A country.” “No way.” Twenty minutes later he asks: “How much land?” You make a checklist: Land. Power. Water. People. Money. Rules. Security. Recognition. Marek adds Flag. “No.” “You need a flag.” Something that was previously a stupid idea is now a stupid idea with a checklist." },
    { id:"pieceWorld", kind:"choice", after:["citadelProblem"], title:"A Piece of the World", body:"Nico finds an isolated island listing. Two coves. A bad dock. Green hills. The phrase UNIQUE SOVEREIGN LIFESTYLE OPPORTUNITY appears twice. It is not sovereign. You check. Three times.", opts:[{k:"a",label:"Go see the island · $1,800"},{k:"b",label:"This is insane"}] },
    { id:"islandInspection", kind:"choice", after:["pieceWorld"], when:()=>!!S.chanceMet.islandTrip, title:"Island Inspection", body:"The boat reaches the island at sunrise. Pine, cliffs, two coves and open water. Marek says “No way.” Positively. Paco disappears into the trees. At sunset you stand on the high point and remember: given enough money, you could build something better. The seller's offer is now fixed.", opts:[{k:"a",label:"Buy the island"},{k:"b",label:"Walk away"}] },
    { id:"paperwork", kind:"report", after:["islandInspection"], when:()=>!!S.bcIsland, title:"Paperwork", body:"Lawyers redefine property for several weeks. Nico signs in the wrong place. Paco eats the corner of the final document. “Country,” Nico says. “Island,” you say. “For now.”" },
    { id:"nobodyKnows", kind:"choice", after:["paperwork"], title:"Nobody Knows We Exist", body:"You have land. You have paperwork. You do not have citizens, recognition, or much reason for anyone to care. An old contact gives you one name: Madame Luck. Marek says, “No way.” Nico says he knows her. Of course he does.", opts:[{k:"a",label:"Make contact · $5,000"},{k:"b",label:"Post about it"}] },
    { id:"theOg", kind:"report", after:["nobodyKnows"], when:()=>!!S.bcOg, title:"The OG", body:"Madame Luck joins seventeen minutes late and asks very good questions. Then she says she will tell some people. Your phone starts vibrating." },
    { id:"peopleAsking", kind:"choice", after:["theOg"], when:()=>S.bcNodes>=10, title:"People Start Asking", body:"Developers, miners and families ask whether they can move in. Nico makes a spreadsheet. Marek finds the problem. “We do not have houses.”", opts:[{k:"a",label:"Build a settlement · 3%"},{k:"b",label:"Not yet"}] },
    { id:"extensionCord", kind:"choice", after:["peopleAsking"], when:()=>!!S.bcSettlement, title:"The Extension Cord Problem", body:"Residents bring refrigerators, computers, pumps, servers and a sauna nobody admits owning. At 8:43 P.M. the island goes dark. Someone asks who was mining.", opts:[{k:"a",label:"Build proper power · 4%"},{k:"b",label:"More extension cords"}] },
    { id:"obviously", kind:"choice", after:["extensionCord"], when:()=>!!S.bcPower, title:"Obviously", body:"The grid works. Nico says you should mine Bitcoin. Obviously. One proposal contains only four words: CHEAP POWER. WE MINE.", opts:[{k:"a",label:"Build the mine · 5%"},{k:"b",label:"Not yet"}] },
    { id:"principality", kind:"report", after:["theOg"], when:()=>S.bcNodes>=25, title:"The Principality", body:"An email arrives from Mr Ortega & Gambette, Foreign Minister of Saint Arnald. Saint Arnald has a flag, an anthem, a website and 614 claimed citizens. They would like relations." },
    { id:"stateVisit", kind:"choice", after:["principality"], title:"State Visit", body:"Saint Arnald has a coastal town, hills, and a government building that may have been a restaurant three months ago. They want Bitcoin infrastructure. You want friends.", opts:[{k:"a",label:"Build a node · $15,000"},{k:"b",label:"Help a little · $5,000"},{k:"c",label:"Just visit"}] },
    { id:"firstBloc", kind:"report", after:["stateVisit"], title:"The First Bloc", body:"Seven countries announce a political and economic bloc covering trade, energy, currency coordination, defense and joint exercises. Every speaker uses the word stability." },
    { id:"protectIsland", kind:"choice", after:["firstBloc"], title:"Who Protects the Island?", body:"Someone steals a boat. Your current security system is one camera and Paco. Paco was asleep.", opts:[{k:"a",label:"Build a defense force · 2%"},{k:"b",label:"Hire private security · $50,000"},{k:"c",label:"Give Paco a vest"}] },
    { id:"placeNow", kind:"report", after:["protectIsland"], when:()=>S.bcNodes>=50, title:"This Is Apparently a Place Now", body:"Coffee shops appear. Then a bakery. Then a bar. Then a newspaper. Its first editorial criticizes you. Nico is delighted. “You made it. You have opposition.”" },
    { id:"citadelQuestion", kind:"choice", after:["placeNow"], title:"The Citadel Question", body:"Marek brings plans for protected power, walls and a hardened center. “Citadel.” A wall can keep people out. It can also keep people safe.", opts:[{k:"a",label:"Build it · 8%"},{k:"b",label:"Not now"}] },
    { id:"rearmament", kind:"report", after:["citadelQuestion"], title:"Rearmament", body:"The Bloc announces more ships, aircraft and bases. A rival group announces the same thing. Nobody appears to be improving global security." },
    { id:"anOffer", kind:"choice", after:["rearmament"], title:"An Offer", body:"A private group offers to buy everything for 35% more than your current net worth. Madame Luck asks one question: “Why did you build it?”", opts:[{k:"a",label:"Sell"},{k:"b",label:"Bitcoin Country is not for sale"}] },
    { id:"ambassador", kind:"report", after:["anOffer"], when:()=>!S.bcArcClosed&&S.bcNodes>=75, title:"The Ambassador", body:"A real ambassador visits. Before leaving, she says: “If you ever decide this is more than a project, call me first.”" },
    { id:"threeColors", kind:"report", after:["ambassador"], title:"Three Colors", body:"Three military blocs now dominate the map. Commentators call it a stable balance. The map has fewer colors than it used to." },
    { id:"ortegaCalls", kind:"choice", after:["threeColors"], title:"Mr Ortega & Gambette Calls", body:"Mr Ortega & Gambette calls with ninety-three pages of advice about recognition, treaties, fisheries and ceremonial precedence.", opts:[{k:"a",label:"Take the full package · $25,000"},{k:"b",label:"Take the useful pages"},{k:"c",label:"Decline politely"}] },
    { id:"theQuestion", kind:"choice", after:["ortegaCalls"], when:()=>S.bcNodes>=100&&!S.bcIndependent, title:"The Question", body:"The checklist is complete enough to become dangerous. Land. Power. People. Money. Rules. Security. Recognition. Marek looks at the last unchecked line. Independence.", opts:[{k:"a",label:"Declare independence"},{k:"b",label:"Not yet"}] },
    { id:"declaration", kind:"report", after:["theQuestion"], when:()=>!!S.bcIndependent, title:"Declaration", body:"You declare independence. Saint Arnald recognizes Bitcoin Country thirty-seven seconds later. Mr Ortega & Gambette sends a thumbs-up and a 14-page attachment." },
    { id:"theAnswer", kind:"report", after:["declaration"], when:()=>!!S.bcIndependent&&!S.chanceMet.bcDefenseResult, title:"The Answer", body:"Recognition is not universal. One of the blocs gives you an answer of its own. The attack begins." },
    { id:"fourthColor", kind:"report", after:["theAnswer"], when:()=>S.chanceMet.bcDefenseResult==="win", title:"A Fourth Color", body:"The attack fails. By morning, statements arrive. Some governments say negotiations. Others avoid the word country. Saint Arnald does not. Marek looks at the map. “No way.” Bitcoin Country is independent. KEEP PLAYING." },
    { id:"notYet", kind:"report", after:["theAnswer"], when:()=>S.chanceMet.bcDefenseResult==="lose", title:"Not Yet", body:"The defense fails. Bitcoin Country does not disappear. The declaration does. The island keeps its residents, homes, businesses and Bitcoin. Independence can wait. KEEP PLAYING." }  ];
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
        creditBtc(share);
        return say("Find the USB. +" + share.toFixed(2) + " BTC.",
          "Find the USB. +" + share.toFixed(2) + " BTC.");
      }
      if (r < 0.00029 + 0.22) {
        arcPay(8);
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
        arcPay(stake * 2);
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
      if (r < 0.06) { arcPay(stake * 8); return say("You scoop the table. +" + money(stake * 8) + ".", "Te llevás la mesa. +" + money(stake * 8) + "."); }
      if (r < 0.28) { arcPay(stake * 3); return say("+" + money(stake * 3) + " on a " + money(stake) + " buy-in.", "+" + money(stake * 3) + " sobre " + money(stake) + "."); }
      if (r < 0.52) { arcPay(stake * 1.4); return say("Min-cash. +" + money(stake * 1.4) + ".", "Min-cash. +" + money(stake * 1.4) + "."); }
      return say("Busted. −" + money(stake) + ".", "Afuera. −" + money(stake) + ".");
    }
    if (card.id === "uncle") {
      if (Math.random() < 0.55) {
        const n = grantWealthPct(0.07);
        return say("Check your account. +" + money(n) + ".", "Fijate la cuenta. +" + money(n) + ".");
      }
      const b = Math.max(0.0001, (wealthUsd() * 0.07) / clampPx(S.price));
      const out = creditBtc(b);
      return say("He sent sats. +" + out.take.toFixed(4) + " BTC" + (out.cash ? " and +" + money(out.cash) : "") + ".",
        "Mandó sats. +" + out.take.toFixed(4) + " BTC" + (out.cash ? " y +" + money(out.cash) : "") + ".");
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
      if(opt==="noidea") return say("“Good,” Marek says. “That is much better than inventing a move.” He shows you 23...Qg3!! The queen can be taken three ways. Every capture loses.","");
      if(opt==="Qg3") return say("You put the queen on g3. Marek looks at the board, then at you. “Annoying.” A beat. “Yes. Qg3.” He makes you calculate all three captures before he lets you enjoy being right.","");
      return say("Marek studies your move without touching the board. “Plausible. Which is why Marshall did something much worse.” He slides the queen to g3. “Now try taking it.”","");
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
        arcPay(paid * 4);
        return say("They actually ship. 4× on " + money(paid) + ".", "De verdad publican. 4× sobre " + money(paid) + ".");
      }
      return say("The domain expired. " + money(paid) + " is a case study.", "Venció el dominio. " + money(paid) + " es un caso de estudio.");
    }
    if (card.id === "tow") {
      const paid = cutBill(85);
      return say("Nine minutes. The sign was very clear. −" + money(paid) + ".", "Nueve minutos. El cartel estaba muy claro. −" + money(paid) + ".");
    }
    if (card.id === "courage") {
      if(opt==="b"){delete S.chanceUsed.courage;return say("You wait. The question does not go away.","");}
      S.hasRing=true;
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
      if(opt==="c"){let p=cutPct(.01);S.familyClosed=true;S.familyPath=false;return say("You tell Lena about the thought you cannot ignore. Building something. Not a company. Not a charity. Something else.\n\nThere is a very long silence.\n\nI'll miss you, Fartface.\n\nYou leave. Paco comes with you.\n\nYou are not entirely sure whether that was his decision.\n\nFAMILY ARC CLOSED\n\nSomething else is now possible.\n\n-"+money(p)+".","");}
      S.familyPath=true;
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
    if(card.id==="justInCase"||card.id==="nothingToHide"||card.id==="somethingBetter")return say("The thought stays with you.","");
    if(card.id==="timeTraveler"){if(opt==="a"){let p=cutBill(666);S.bcBook=true;return say("The book arrives. -"+money(p)+".","");}delete S.chanceUsed.timeTraveler;return say("You close the browser. For now.","");}
    if(card.id==="temporaryMeasures")return say("Markets fall. Bitcoin does not.","");
    if(card.id==="citadelProblem")return say("Bitcoin Country unlocked.","");
    if(card.id==="pieceWorld"){if(opt==="a"){let p=cutBill(1800);S.chanceMet.islandTrip=true;S.bcIslandOffer=wealthUsd()*(.10+Math.random()*.15);return say("Trip booked. -"+money(p)+".","");}delete S.chanceUsed.pieceWorld;return say("Nico sends the listing again tomorrow.","");}
    if(card.id==="islandInspection"){if(opt==="a"){let p=cutPct(Math.min(1,S.bcIslandOffer/Math.max(1,wealthUsd())));S.bcIsland=true;return say("You own an island. -"+money(p)+".","");}delete S.chanceUsed.islandInspection;return say("The island remains available at "+money(S.bcIslandOffer)+".","");}
    if(card.id==="paperwork")return say("Country. Island. For now.","");
    if(card.id==="nobodyKnows"){if(opt==="a"){let p=cutBill(5000);S.bcOg=true;return say("INTERESTING. CALL ME. -"+money(p)+".","");}delete S.chanceUsed.nobodyKnows;return say("Three followers. One is Nico.","");}
    if(card.id==="theOg"){S.bcNodes=Math.max(1,S.bcNodes);S.bcNodeTick=S.candles||0;return say("Liberty Nodes: "+S.bcNodes+"/100.","");}
    if(card.id==="peopleAsking"){if(opt==="a"){let p=cutPct(.03);S.bcSettlement=true;return say("Settlement built. -"+money(p)+".","");}delete S.chanceUsed.peopleAsking;return say("Not yet.","");}
    if(card.id==="extensionCord"){if(opt==="a"){let p=cutPct(.04);S.bcPower=true;return say("Power grid built. -"+money(p)+".","");}delete S.chanceUsed.extensionCord;return say("More extension cords.","");}
    if(card.id==="obviously"){if(opt==="a"){let p=cutPct(.05);S.bcMine=true;return say("Bitcoin mine online. -"+money(p)+".","");}delete S.chanceUsed.obviously;return say("Not yet.","");}
    if(card.id==="principality")return say("Saint Arnald sidequest unlocked.","");
    if(card.id==="stateVisit"){if(opt==="a"){let p=cutBill(15000);S.bcNodes=Math.min(100,S.bcNodes+10);return say("+10 Liberty Nodes. -"+money(p)+".","");}if(opt==="b"){let p=cutBill(5000);S.bcNodes=Math.min(100,S.bcNodes+4);return say("The node is not plugged in. +4 Liberty Nodes. -"+money(p)+".","");}return say("Nico takes some stamps.","");}
    if(card.id==="firstBloc"){S.bcWorld+=4;return say("World Military Strength: "+S.bcWorld+".","");}
    if(card.id==="protectIsland"){if(opt==="a"){let p=cutPct(.02);S.bcArmyUnlocked=true;S.bcArmy=Math.max(10,S.bcArmy);return say("Army unlocked: "+S.bcArmy+". -"+money(p)+".","");}if(opt==="b"){let p=cutBill(50000);return say("Private security. For now. -"+money(p)+".","");}return say("Paco gets a SECURITY vest.","");}
    if(card.id==="placeNow"){S.bcNodes=Math.min(100,S.bcNodes+5);return say("+5 Liberty Nodes.","");}
    if(card.id==="citadelQuestion"){if(opt==="a"){let p=cutPct(.08);S.bcCitadel=true;return say("Citadel built. -"+money(p)+".","");}return say("The plans stay on the table.","");}
    if(card.id==="rearmament"){S.bcWorld+=6;return say("World Military Strength: "+S.bcWorld+".","");}
    if(card.id==="anOffer"){if(opt==="a"){grantWealthPct(.35);S.bcArcClosed=true;return say("Bitcoin Country arc closed. +35% net worth.","");}S.bcNodes=Math.min(100,S.bcNodes+10);return say("BITCOIN COUNTRY IS NOT FOR SALE. +10 Liberty Nodes.","");}
    if(card.id==="ambassador")return say("Diplomatic contact unlocked.","");
    if(card.id==="threeColors"){S.bcWorld+=5;return say("World Military Strength: "+S.bcWorld+".","");}
    if(card.id==="ortegaCalls"){if(opt==="a"){let p=cutBill(25000);S.bcNodes=Math.min(100,S.bcNodes+10);return say("A Ministry of Fisheries asks whether Bitcoin Country produces pickled bluefin sand eel. You say yes. This appears to help. +10 Liberty Nodes. -"+money(p)+".","");}if(opt==="b"){S.bcNodes=Math.min(100,S.bcNodes+4);return say("+4 Liberty Nodes.","");}return say("Mr Ortega & Gambette emails the 93 pages anyway.","");}
    if(card.id==="theQuestion"){if(opt==="a"){S.bcIndependent=true;return say("You declare.","");}delete S.chanceUsed.theQuestion;return say("Not yet.","");}
    if(card.id==="declaration")return say("Saint Arnald recognizes Bitcoin Country in thirty-seven seconds.","");
    if(card.id==="theAnswer"){startDefense();return say("The attack begins.","");}
    if(card.id==="fourthColor"){S.bcIndependent=true;return say("THE FOURTH COLOR. Bitcoin Country is independent. KEEP PLAYING.","");}
    if(card.id==="notYet"){S.bcIndependent=false;delete S.chanceMet.bcDefenseResult;delete S.chanceUsed.theQuestion;delete S.chanceUsed.declaration;delete S.chanceUsed.theAnswer;delete S.chanceUsed.notYet;return say("Not yet. KEEP PLAYING.","");}
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
        arcPay(paid * 2.2);
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
        arcPay(stake * 3);
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

  const BC_ART=Object.fromEntries(["justInCase","nothingToHide","somethingBetter","timeTraveler","temporaryMeasures","citadelProblem","pieceWorld","islandInspection","paperwork","nobodyKnows","theOg","peopleAsking","extensionCord","obviously","principality","stateVisit","firstBloc","protectIsland","placeNow","citadelQuestion","rearmament","anOffer","ambassador","threeColors","ortegaCalls","theQuestion","declaration","theAnswer","fourthColor","notYet"].map(x=>[x,1]));
  const ARC_VID = { landfill: 1, wine: 1, proposal: 1, tetris: 1, casino: 1, mexico: 1, phish: 1, baby: 1 };
  let chanceArtBusy = false;
  function preloadChanceArt() {
    if (chanceArtBusy) return;
    chanceArtBusy = true;
    const ids = CHANCE_CARDS.map((c) => c.id);
    ids.push("hero");
    let i = 0;
    const kick = (n) => {
      while (n-- > 0 && i < ids.length) {
        const im = new Image();
        im.decoding = "async";
        im.onload = im.onerror = () => kick(1);
        const id=ids[i++]; im.src="chance/"+id+(BC_ART[id]?".svg":".jpg");
      }
    };
    kick(4);
    Object.keys(ARC_VID).forEach((id) => {
      const v = document.createElement("video");
      v.muted = true;
      v.preload = "auto";
      v.playsInline = true;
      v.src = "chance/" + id + ".mp4";
    });
  }
  function chanceArtHtml(id) {
    const jpg="chance/"+id+(BC_ART[id]?".svg":".jpg");
    if (ARC_VID[id]) {
      return "<video class=\"chance-art\" src=\"chance/" + id + ".mp4\" poster=\"" + jpg + "\" autoplay muted loop playsinline preload=\"auto\"></video>";
    }
    return "<img class=\"chance-art\" src=\"" + jpg + "\" alt=\"\" onerror=\"this.src='chance/hero.jpg'\">";
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
      if (c.when && !c.when()) return false;
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
    if (!src.length && !window.__arcForce) return;
    const forced = window.__arcForce && CHANCE_CARDS.find((c) => c.id === window.__arcForce);
    const card = forced || (src.length ? src[(Math.random() * src.length) | 0] : null);
    if (!card) return;
    S.chanceUsed[card.id] = true;
    S.chanceCard = card;
    S.chanceNote = "";
    S.chanceReadyNote = "";
    S.chanceLead = "";
    S.chanceSettled = false;
    S.arcPending = null;
    S.arcTldr = "";
    S.arcHold = false;
    const es0 = chanceLang();
    let body = weaveCast(es0 ? (card.bodyEs || card.body) : card.body);
    if (card.kind === "report") {
      const before = bagSnap();
      S.chanceReadyNote = resolveChance(card, "ok");
      S.arcPending = bagSnap();
      S.arcTldr = formatArcTldr(before, S.arcPending);
      S.cash = before.cash; S.btc = before.btc; S.cold = before.cold;
      S.invuln = before.invuln;
      S.msig = before.msig;
      S.chanceSettled = true;
      S.chanceBody = body;
    } else {
      S.chanceBody = body;
    }
    try { A.speak("Arc"); } catch (e) {}
    setPhase("chance");
    renderHud();
  }

  function bagSnap() {
    return { cash: S.cash, btc: S.btc, cold: S.cold, invuln: S.invuln || 0, msig: S.msig || 0 };
  }
  function formatArcTldr(before, after) {
    const es = chanceLang();
    const bits = [];
    const dCash = (after.cash || 0) - (before.cash || 0);
    const dBtc = (after.btc || 0) - (before.btc || 0);
    const dCold = (after.cold || 0) - (before.cold || 0);
    const dMsig = (after.msig || 0) - (before.msig || 0);
    if (Math.abs(dCash) >= 0.5) bits.push((dCash > 0 ? "+" : "−") + money(Math.abs(dCash)));
    if (Math.abs(dBtc) >= 1e-8) bits.push((dBtc > 0 ? "+" : "−") + fmtBtcAmt(Math.abs(dBtc)) + " BTC");
    if (dCold) bits.push((dCold > 0 ? "+" : "") + dCold + " cold");
    if (dMsig) bits.push((dMsig > 0 ? "+" : "") + dMsig + " multisig");
    if ((after.invuln || 0) > (before.invuln || 0) + 0.4) {
      bits.push(es ? "unos segundos de invulnerabilidad" : "a few seconds of invuln");
    }
    return bits.join(" · ");
  }
  function peelArcNote(note) {
    return String(note || "")
      .replace(/(?:\n\s*)+[+\-−–]?\s*\$[\d.,]+[kMBT]?\.?\s*$/gi, "")
      .replace(/(?:\n\s*)+[+\-−–]\s*[\d.,]+\s*BTC\.?\s*$/gi, "")
      .trim();
  }
  function punchline(note) {
    const s = peelArcNote(note);
    if (!s) return "";
    const compact = String(s).replace(/\s+/g, " ").trim();
    const m = compact.match(/^[^.!?]+[.!?]?/);
    let line = (m ? m[0] : compact).trim();
    if (line.length > 148) line = line.slice(0, 145).replace(/\s+\S*$/, "") + "…";
    return line;
  }
  function withArcDelta(text) {
    const d = String(S.arcTldr || "").trim();
    const s = String(text || "").trim();
    if (!d) return s;
    if (s && s.indexOf(d) >= 0) return s;
    return s ? s + "\n" + d : d;
  }
  function arcStoryHtml(card, body) {
    const tldr = cardTldr(card);
    const text = ARC_TLDR ? (tldr || body) : body;
    return "<p class=\"arc-body\">" + text + "</p>";
  }
  function arcOutcomeHtml() {
    const shown = peelArcNote(S.chanceNote) || S.chanceNote || "";
    let text;
    if (ARC_TLDR) {
      const punch = punchline(shown) || shown;
      const tldr = S.chanceCard ? cardTldr(S.chanceCard) : "";
      text = punch || tldr;
    } else {
      text = shown;
    }
    return "<p class=\"arc-body\">" + withArcDelta(text) + "</p>";
  }

  function commitArcBooks() {
    if (S.arcPending) {
      S.cash = S.arcPending.cash;
      S.btc = S.arcPending.btc;
      S.cold = S.arcPending.cold;
      if (S.arcPending.invuln != null) S.invuln = S.arcPending.invuln;
      if (S.arcPending.msig != null) S.msig = S.arcPending.msig;
      S.arcPending = null;
      clampHoldings();
    }
    try { renderHud(); } catch (e) {}
  }
  function finishArcHold() {
    commitArcBooks();
    S.chanceCard = null;
    S.chanceNote = "";
    S.chanceReadyNote = "";
    S.chanceBody = "";
    S.chanceSettled = false;
    S.arcTldr = "";
    S.arcHold = true;
    S.optBack = "play";
    S.optPanel = null;
    setPhase("paused");
  }

  let arcClickLock = 0;
  function pickChance(opt) {
    const now = performance.now();
    if (now - arcClickLock < 280) return;
    arcClickLock = now;
    const card = S.chanceCard;
    if (!card) { finishArcHold(); return; }
    if (!S.chanceNote) {
      if (card.kind === "report" || S.chanceSettled) {
        if (S.arcPending) { S.cash=S.arcPending.cash; S.btc=S.arcPending.btc; S.cold=S.arcPending.cold; S.invuln=S.arcPending.invuln; S.msig=S.arcPending.msig; }
        S.chanceNote=S.chanceReadyNote||"";
        finishArcHold();
        renderHud();
        return;
      }
      const before = bagSnap();
      S.chanceNote = resolveChance(card, opt);
      S.arcPending = bagSnap();
      S.arcTldr = formatArcTldr(before, S.arcPending);
      S.cash = before.cash; S.btc = before.btc; S.cold = before.cold;
      S.invuln = before.invuln;
      S.msig = before.msig;
      renderOverlay();
      renderHud();
      return;
    }
    finishArcHold();
  }

  function tickJobChance() {
    if(S.bcOg&&!S.bcArcClosed&&(S.candles||0)>0&&(S.candles||0)%21===0&&S.bcNodeTick!==(S.candles||0)){S.bcNodeTick=S.candles||0;S.bcNodes=Math.min(100,(S.bcNodes||0)+(S.bcSettlement?2:1));if(S.bcMine)creditBtc(.01);say("Liberty Nodes "+S.bcNodes+"/100",false,"ui");}
    if ((S.have.job || 0) > 0 && S.candles > 0 && S.candles % 21 === 0) payJob();
    if (S.mp) return;
    if ((S.have.chance || 0) > 0) {
      if (!S.chanceAt || !S.chanceAt.length) planChanceWindow(S.candles || 0);
      if (S.chanceAt && S.chanceAt.indexOf(S.candles) >= 0 && S.phase === "play") dealChance();
      if (S.chanceUntil && S.candles >= S.chanceUntil) planChanceWindow(S.candles);
    }
  }

  function perkOpen() {
    const ids = ["dca", "ff", "adopt", "manip", "candy", "juke", "aibud", "job", "market", "chance", "opsec"].filter((id) => {
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
    if (S.mp) return false;
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
    if (S.mp) return;
    const left = perkOpen();
    if (!left.length) return;
    rollPerks();
    if (!S.perkOffers || !S.perkOffers.length) return;
    if (S.perkOffers[S.perkOffers.length - 1] !== "skip") S.perkOffers.push("skip");
    S.perkPick = "";
    if (!forceUi && S.aibudOn && (S.have.aibud || 0) >= 2) {
      const real = S.perkOffers.filter((id) => id !== "skip");
      if (!real.length) { bumpOffer(); return; }
      const pick = bestAiPerk(real);
      grantPerk(pick.id);
      bumpOffer();
      aiAct("Perk " + perkTitle(pick.id, S.have[pick.id]), pick.why);
      say(aiPerkVoice(pick.id), true, "aibud");
      return;
    }
    if (why === "laser") say("Fibonacci treshold reached, grab your perk!", true);
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
    if (id === "dca") return "Income becomes bitcoin";
    if (id === "candy") return "More candle cash to stack sats";
    if (id === "job") return "Paycheck to convert into bitcoin";
    if (id === "aibud") return "Better timing for the stack";
    if (id === "manip") return "Steer price while we accumulate";
    if (id === "market") return "Lasers and lives to keep stacking";
    if (id === "adopt") return "Tamer bears protect the bag";
    if (id === "chance") return "Arc shots at more bitcoin";
    if (id === "ff") return "More candles, more cash to stack";
    if (id === "juke") return "No stack value, last resort";
    if (id === "opsec") return "Extra lives to keep stacking";
    return "Best for stacking bitcoin";
  }

  function aiPerkVoice(id) {
    const name = {
      dca: "D.C.A.",
      candy: "Candle candy",
      job: "Employment",
      aibud: "an A.I. bud upgrade",
      manip: "Manipulation",
      adopt: "Adoption",
      market: "Marketplace",
      chance: "Arc",
      ff: "FastForward",
      juke: "Jukebox",
      opsec: "Opsec"
    }[id] || "a perk";
    const lines = [
      "A.I. bud takes " + name,
      "A.I. bud picks " + name,
      "Stacking with " + name
    ];
    return lines[(Math.random() * lines.length) | 0];
  }

  function bestAiPerk(ids) {
    const have = S.have || {};
    const aiT = have.aibud || 0;
    const dca = (have.dca || 0) > 0;
    const holding = (S.btc || 0) > 1e-8;
    const lives = (S.cold || 0) + (S.msig || 0);
    const score = (id) => {
      if (!id || id === "skip") return -1;
      if (id === "market" && S.ranked && lives < 1) return 110;
      if (id === "opsec" && S.ranked && lives < 1) return 108;
      if (id === "dca" && !dca) return 100;
      if (id === "aibud" && aiT < 4) return 96;
      if (id === "manip") return 90;
      if (id === "market") return 86;
      if (id === "candy") return dca ? 82 : 76;
      if (id === "job") return dca ? 80 : 64;
      if (id === "aibud" && aiT < 6) return 72;
      if (id === "chance") return 54;
      if (id === "ff") return 36;
      if (id === "aibud") return 22;
      if (id === "juke") return 18;
      if (id === "adopt") return 8;
      if (id === "opsec") return 4;
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
      say("A.I. bud is timing the market for you!", true, "aibud");
    }
  }

  function tickAiTiming() {
    if (S.aiTimingStart == null || S.phase !== "play") return;
    if ((S.aiTimingLast || 0) && S.lifeT - S.aiTimingLast < 60) return;
    if (!S.aiTimingLast && S.lifeT - S.aiTimingStart < 60) return;
    S.aiTimingLast = S.lifeT;
    say("A.I. bud is timing the market for you!", true, "aibud");
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
        S.aibudLitAt = Object.assign({}, S.aibudLitAt, { sell: S.lifeT, buy: 0 });
        S.aiTradeAt = S.candles || 0;
        markAiTrade();
        aiAct("Sold BTC", incomingDump ? "Dump incoming · raise cash for the dip" : "Sold the bull · raise cash for the dip");
        acted = true;
      } else if (shouldBuy) {
        S.aiSilent = true; buyBtc(); S.aiSilent = false;
        S.iaProfit += netBtc() - bag;
        S.aibudLit = Object.assign({}, S.aibudLit, { buy: true, sell: false });
        S.aibudLitAt = Object.assign({}, S.aibudLitAt, { buy: S.lifeT, sell: 0 });
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

  function defenseProfile(){
    const delta=(S.bcArmy||0)-(S.bcWorld||20);
    if(delta<=-30)return {waves:8,rate:.72,enemy:1.30};
    if(delta<=-15)return {waves:7,rate:.80,enemy:1.20};
    if(delta<=-5)return {waves:6,rate:.88,enemy:1.12};
    if(delta<10)return {waves:6,rate:1,enemy:1};
    if(delta<25)return {waves:5,rate:1.08,enemy:.92};
    return {waves:4,rate:1.16,enemy:.84};
  }
  function defenseUpgrades(){
    const a=S.bcArmy||0;
    return {mob:a>=40,armor1:a>=50,cannon1:a>=60,cannon2:a>=70,armor2:a>=80,cannon3:a>=90,wall:a>=100};
  }
  function buyArmy(points){
    points=Math.max(1,Math.floor(points||10));if(!S.bcArmyUnlocked||S.bcIndependent||S.bcArcClosed)return false;
    const room=Math.max(0,100-(S.bcArmy||0)),add=Math.min(room,points);if(!add)return false;
    const pct=add*.0025,p=cutPct(pct);S.bcArmy=(S.bcArmy||0)+add;S.bcArmySpend=(S.bcArmySpend||0)+p;
    say("Army "+S.bcArmy+"/100 · -"+money(p),false,"ui");return true;
  }
  window.ChoppyBitcoinCountry=window.ChoppyBitcoinCountry||{};
  window.ChoppyBitcoinCountry.buyArmy=buyArmy;
  window.ChoppyBitcoinCountry.status=()=>({nodes:S.bcNodes||0,army:S.bcArmy||0,world:S.bcWorld||20,citadel:!!S.bcCitadel,independent:!!S.bcIndependent});
  function startDefense(){
    const p=defenseProfile(),u=defenseUpgrades();
    S.bcDefense={x:240,shots:[],enemies:[],wave:1,waves:p.waves,spawn:.5,spawned:0,kills:0,quota:5,integrity:100,wall:u.wall?100:0,done:false,fire:0,inv:0,profile:p,up:u};
    S.phase="defense";
    if(field){field.classList.remove("is-play");field.classList.add("defense-mode");}
    hideOverlay();
  }
  function defenseEnemy(d){
    const r=Math.random(),w=d.wave;
    let type="STANDARD",hp=1,v=58,damage=10,size=17;
    if(w>=2&&r<.25){type="FAST";v=105;damage=8;size=13;}
    else if(w>=3&&r<.47){type="HEAVY";hp=3;v=43;damage=18;size=22;}
    else if(w>=5&&r<.62){type="ELITE";hp=2;v=82;damage=15;size=18;}
    d.enemies.push({x:32+Math.random()*416,y:-28,hp,maxHp:hp,v:v*d.profile.enemy,damage,size,type,phase:Math.random()*6.28});
  }
  function finishDefense(win){
    const d=S.bcDefense;if(!d||d.done)return;d.done=true;S.chanceMet.bcDefenseResult=win?"win":"lose";
    S.phase="play";if(field)field.classList.remove("defense-mode");setTimeout(()=>dealChance(),120);
  }
  function stepDefense(dt){
    const d=S.bcDefense;if(!d||d.done)return;
    d.fire=Math.max(0,d.fire-dt);d.inv=Math.max(0,d.inv-dt);d.spawn-=dt;
    if(d.spawned<d.quota&&d.spawn<=0){defenseEnemy(d);d.spawned++;d.spawn=(.78+Math.random()*.42)/d.profile.rate;}
    d.shots.forEach(s=>s.y-=s.v*dt);d.shots=d.shots.filter(s=>s.y>-25&&!s.hit);
    d.enemies.forEach(e=>{e.phase+=dt*3;e.y+=e.v*dt;if(e.type==="FAST")e.x+=Math.sin(e.phase)*45*dt;});
    for(const e of d.enemies)for(const s of d.shots)if(!s.hit&&Math.abs(e.x-s.x)<e.size+5&&Math.abs(e.y-s.y)<e.size+10){s.hit=true;e.hp-=s.damage;if(e.hp<=0)d.kills++;};
    d.enemies=d.enemies.filter(e=>e.hp>0);
    const leaks=d.enemies.filter(e=>e.y>610);d.enemies=d.enemies.filter(e=>e.y<=610);
    for(const e of leaks){
      if(d.wall>0){d.wall=Math.max(0,d.wall-e.damage*2);continue;}
      if(d.inv>0)continue;
      d.integrity=Math.max(0,d.integrity-e.damage);
      if(d.up.armor1)d.inv=d.up.armor2?1.25:.65;
    }
    if(d.integrity<=0){finishDefense(false);return;}
    if(d.spawned>=d.quota&&d.enemies.length===0){
      if(d.wave>=d.waves){finishDefense(true);return;}
      d.wave++;d.spawned=0;d.quota=5+Math.floor(d.wave*1.4);d.spawn=.8;
    }
  }
  function drawDefense(ctx){
    const d=S.bcDefense;if(!d)return;
    drawWorldBg(ctx,null);
    drawTape(ctx,S.tape,S.H*.196,S.H*.804,palRgba(GREEN,.34),palRgba(RED,.34));
    ctx.save();
    ctx.fillStyle="rgba(5,10,16,.34)";ctx.fillRect(0,0,S.W,S.H);
    ctx.strokeStyle=palRgba(PAL.fg,.14);ctx.lineWidth=1;
    for(let y=84;y<560;y+=54){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(S.W,y);ctx.stroke();}
    if(d.wall>0){
      ctx.fillStyle=palRgba(PAL.fg,.68);ctx.fillRect(0,582,S.W,4);
      for(let bx=0;bx<S.W;bx+=32){ctx.fillStyle=bx%64?palRgba(PAL.fg,.34):palRgba(BTC,.55);ctx.fillRect(bx,566,27,16);}
    }
    const blink=d.inv>0&&Math.floor(d.inv*12)%2===0;
    if(!blink)drawBirdAt(ctx,d.x,548,0,18,myHero(),null,1,false,HERO_ANIM,HERO_SKIN);
    for(const s of d.shots){
      ctx.strokeStyle=BTC;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(s.x,s.y+9);ctx.lineTo(s.x,s.y-9);ctx.stroke();
      ctx.fillStyle=palRgba(BTC,.3);ctx.fillRect(s.x-5,s.y-5,10,10);
    }
    for(const e of d.enemies){
      const col=e.type==="FAST"?BTC:e.type==="HEAVY"?palRgba(PAL.fg,.78):e.type==="ELITE"?"#b989d6":RED;
      ctx.fillStyle=col;ctx.strokeStyle=palRgba(PAL.fg,.72);ctx.lineWidth=1.5;
      ctx.fillRect(e.x-e.size,e.y-e.size*.65,e.size*2,e.size*1.3);ctx.strokeRect(e.x-e.size,e.y-e.size*.65,e.size*2,e.size*1.3);
      ctx.fillStyle=PAL.ink;ctx.font="700 "+Math.max(9,e.size-3)+"px \"IBM Plex Mono\",monospace";ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText(e.type==="FAST"?"▲":e.type==="HEAVY"?"■":e.type==="ELITE"?"◆":"●",e.x,e.y);
      if(e.maxHp>1){ctx.fillStyle=palRgba(PAL.fg,.2);ctx.fillRect(e.x-e.size,e.y-e.size-7,e.size*2,3);ctx.fillStyle=BTC;ctx.fillRect(e.x-e.size,e.y-e.size-7,e.size*2*(e.hp/e.maxHp),3);}
    }
    ctx.textBaseline="alphabetic";ctx.textAlign="left";ctx.font='700 12px "IBM Plex Mono",monospace';
    paintHaloText(ctx,"CITADEL "+d.integrity+"%",12,21,d.integrity<35?RED:PAL.fg);
    paintHaloText(ctx,"WAVE "+d.wave+"/"+d.waves,12,41,PAL.fg);
    ctx.textAlign="right";paintHaloText(ctx,"ENEMIES "+(d.enemies.length+Math.max(0,d.quota-d.spawned)),S.W-12,21,PAL.fg);
    if(d.wall>0)paintHaloText(ctx,"WALL "+d.wall+"%",S.W-12,41,BTC);
    ctx.textAlign="left";ctx.font='700 11px "IBM Plex Mono",monospace';paintHaloText(ctx,"ARMY "+(S.bcArmy||0)+"  WORLD "+(S.bcWorld||20),12,S.H-12,PAL.fg);
    ctx.restore();
  }
  function defenseInput(clientX,fire){
    const d=S.bcDefense;if(!d)return;const r=canvas.getBoundingClientRect(),speed=d.up.mob?1.2:1;
    d.x=Math.max(28,Math.min(452,(clientX-r.left)*480/r.width));
    if(fire&&d.fire<=0){
      d.fire=.22/speed;const v=d.up.cannon1?486:360,damage=d.up.cannon3?2:1;
      d.shots.push({x:d.x,y:525,v,damage});
      if(d.up.cannon2)d.shots.push({x:d.x-11,y:530,v,damage});
      if(d.up.cannon3)d.shots.push({x:d.x+11,y:530,v,damage},{x:d.x-20,y:535,v,damage});
    }
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
      field.classList.toggle("perk-ui", p === "perk" || p === "chance" || (p === "paused" && S.arcHold));
      field.classList.toggle("is-play", p === "play");
    }
    try { renderOverlay(); } catch (e) { if (p !== "play") showOverlay(); }
    try { renderHud(); } catch (e) {}
  }

  function startGame(ranked) {
    if (!S.mp) { S.worldSeed = 0; S.worldRand = null; S.mpOver = false; S.mpPlayAt = 0; }
    S.ranked = ranked !== false;
    if (A && A.unlock) try { A.unlock(); } catch (e) {}
    if (A && A.sfx && A.sfx.start) try { A.sfx.start(); } catch (e) {}
    S.humanInput = true;
    S.introCounted = true;
    preloadChanceArt();
    if (!S.welcomed) {
      S.welcomed = true;
      try {
        A.speak(formatVoice("Welcome to Choppy Bitcoin: Survive the market!"));
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

  function keepPlaying() {
    S.hitCap = true;
    S.runTab = null;
    setPhase("play");
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
    if (S.laserOn || liveWaves(S.lifeT).length) speed *= 1.28;
    for (const f of S.floats) f.x -= speed * dt;
    if ((S.waves || []).length) {
      S.cycleManip = Math.max(0.15, (S.cycleManip || 1) * (1 + trendBias() * dt));
      const now = S.lifeT;
      let sum = 0;
      let live = false;
      for (const w of S.waves) {
        sum += waveK(w, now);
        if (waveLive(w, now)) live = true;
      }
      S.price = clampPx((S.priceBase || S.cycleStart || S.price) * waveMul(sum) * S.cycleManip);
      if (S.level >= 2 && S.vtCycle > 0) S.vtPrice = Math.max(1, S.vtCycle * (1 + sum * 0.45) * S.cycleManip);
      noteCyclePrice();
      updateTapeLive(now);
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
      S.tapeCash.push(S.cash);
      S.tapeBtcBag.push(S.btc);
      S.tapeNet.push(netBtc());
      if (S.level >= 2) S.tapeVt.push(S.vtPrice);
      S.sampleAcc -= 0.12;
    }
    if (!S.hitCap && (S.btc || 0) >= BTC_CAP) {
      S.btc = BTC_CAP;
      S.hitCap = true; A.sfx.cap();
      if (S.mp) return;
      A.speak(t("floatYours"), true);
      snapshotRun();
      try { S.best = saveBest(scoreSats()); } catch (e) {}
      setPhase("win");
      return;
    }
    if (S.laserOn) { S.laserT -= dt; if (S.laserT <= 0) applyLaser(false); }
    const watching = !!(S.mp && S.spectate);
    if (watching) {
      const foc = mpFocusPlayer();
      if (foc && foc.y != null) {
        S.bird.y = foc.y;
        S.bird.v = foc.v || 0;
      }
    } else {
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
          if (S.dead && !S.spectate) return;
        }
      }
      if (S.bird.y + S.bird.r < 0) { S.bird.y = -S.bird.r + 1; S.bird.v = 0; }
    }

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
        p.scored = true;
        if (p.finish) {
          if (!watching) mpFinishRace();
        } else {
          S.candles++; A.sfx.coin();
          grantUsd(100, p.x + pw * 0.5, p.gapY - 50, "gain");
          tickJobChance();
          if (!S.ranked && S.candles > 0 && S.candles % 10 === 0) openPerkOffer();
        }
      }
      const inX = S.bird.x + hitR > p.x + 2 && S.bird.x - hitR < p.x + pw - 2;
      if (inX && !p.finish && !watching) {
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
      pinItem(it);
      if (it.freeX) it.x -= speed * dt;
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
      if (!watching && dx * dx + dy * dy < (hitR + it.r) * (hitR + it.r)) { collect(it); S.items.splice(j, 1); continue; }
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

  function powerPal(type) {
    const simple = PALETTE_ID === "simple";
    const paper = PALETTE_ID === "paper";
    const light = simple || paper;
    const flower = PALETTE_ID === "flower";
    const sunset = PALETTE_ID === "sunset";
    const halo = light ? "#111111" : "rgba(0,0,0,0.9)";
    if (simple) {
      return {
        BULL: { fill: "#1a9a44", ring: "#04150c", ink: "#ffffff", halo: halo },
        BEAR: { fill: "#d42a22", ring: "#1a0605", ink: "#ffffff", halo: halo },
        LASER: { fill: "#1a0a08", ring: "#111111", ink: "#ff2a22", halo: halo },
        COLD: { fill: "#0b8bb8", ring: "#041318", ink: "#ffffff", halo: halo },
        SWAN: { fill: "#161616", ring: "#111111", ink: "#f3efe6", halo: halo },
        HALVE: { fill: "#e8a808", ring: "#1a1204", ink: "#1a1204", halo: halo }
      }[type];
    }
    const pal = {
      BULL: { fill: "#1f8a4c", ring: "#9dffc4", ink: light ? "#04150c" : "#04150c", halo: halo },
      BEAR: { fill: "#a33a32", ring: "#ff9b92", ink: "#1a0605", halo: halo },
      LASER: { fill: "#120806", ring: "#ffe7c2", ink: "#ff2d24", halo: halo },
      COLD: { fill: "#1788a6", ring: "#9befff", ink: light ? "#ffffff" : "#041318", halo: halo },
      SWAN: light
        ? { fill: "#1a1a1c", ring: "#0a0a0c", ink: "#f3efe6", halo: halo }
        : { fill: "#f3efe6", ring: "#1a1a1c", ink: "#0a0a0c", halo: halo },
      HALVE: { fill: "#c8960a", ring: "#ffe7a0", ink: "#1a1204", halo: halo }
    }[type];
    if (!pal) return null;
    if (flower && type === "HALVE") { pal.fill = "#fff4c8"; pal.ring = "#2a0838"; pal.ink = "#2a0838"; }
    if (sunset && type === "HALVE") { pal.fill = "#ffe9b8"; pal.ring = "#1a0808"; pal.ink = "#1a0808"; }
    if (sunset && type === "BULL") { pal.fill = "#2a8a48"; pal.ring = "#04150c"; }
    if (paper && type === "COLD") pal.ink = "#ffffff";
    return pal;
  }
  function drawPowerIcon(ctx, it, wash) {
    const r = it.r;
    const pal = powerPal(it.type);
    if (!pal) return;
    const fill = wash || pal.fill;
    const ring = wash || pal.ring;
    const ink = wash ? "#04150c" : pal.ink;
    ctx.save();
    ctx.translate(it.x, it.y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = pal.halo || "#000";
    ctx.lineWidth = 3.6;
    ctx.stroke();
    ctx.strokeStyle = ring;
    ctx.lineWidth = 1.8;
    ctx.stroke();
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

  function tapeBucket(data, i, n, prevC) {
    const end = Math.min(n, i + 4);
    let o = prevC != null ? prevC : data[i];
    let h = data[i], l = data[i];
    for (let j = i + 1; j < end; j++) {
      const v = data[j];
      if (v > h) h = v;
      if (v < l) l = v;
    }
    return { o: o, h: h, l: l, c: data[end - 1] };
  }

  function paintHaloText(ctx, text, x, y, fill) {
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 3.6;
    ctx.strokeStyle = "rgba(0,0,0,0.9)";
    ctx.strokeText(text, x, y);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(255,255,255,0.88)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function drawTape(ctx, data, y0, y1, up, dn) {
    if (data.length < 2) return;
    const bucket = 4, cw = 4.75, stepX = 5.1;
    const maxFit = Math.max(10, (S.W * 0.78 / stepX) | 0);
    const n = data.length;
    const extra = n - ((n / bucket) | 0) * bucket;
    const phase = n + Math.min(1, (S.sampleAcc || 0) / 0.12);
    const candles = phase / bucket;
    const scrolling = candles >= maxFit;
    const raw = scrolling ? candles - maxFit : 0;
    const startB = raw | 0;
    const startI = startB * bucket;
    const offsetX = scrolling ? (raw - startB) * stepX : 0;

    let vis = S._tapeVis;
    if (!vis) vis = S._tapeVis = [];
    const want = Math.ceil((n - startI) / bucket);

    if (S._tvStart !== startI || !vis.length) {
      vis.length = 0;
      let prevC = null;
      for (let i = startI; i < n; i += bucket) {
        const b = tapeBucket(data, i, n, prevC);
        vis.push(b);
        prevC = b.c;
      }
      S._tvStart = startI;
      S._tvN = n;
      if (!vis.length) return;
      let vlo = vis[0].l, vhi = vis[0].h;
      for (let k = 1; k < vis.length; k++) {
        const b = vis[k];
        if (b.l < vlo) vlo = b.l;
        if (b.h > vhi) vhi = b.h;
      }
      S._tvLo = vlo;
      S._tvHi = vhi;
    } else if (S._tvN !== n) {
      if (vis.length > want) vis.length = want;
      while (vis.length < want) {
        const i = startI + vis.length * bucket;
        vis.push(tapeBucket(data, i, n, vis.length ? vis[vis.length - 1].c : null));
      }
      if (vis.length) {
        const idx = vis.length - 1;
        const last = tapeBucket(data, startI + idx * bucket, n, idx ? vis[idx - 1].c : null);
        vis[idx] = last;
        if (last.l < S._tvLo) S._tvLo = last.l;
        if (last.h > S._tvHi) S._tvHi = last.h;
      }
      S._tvN = n;
    }
    if (!vis.length) return;

    const last = vis[vis.length - 1];
    const live = extra > 0 ? S.price : last.c;
    const lastH = live > last.h ? live : last.h;
    const lastL = live < last.l ? live : last.l;
    const lastC = extra > 0 ? live : last.c;

    let visLo = lastL < S._tvLo ? lastL : S._tvLo;
    let visHi = lastH > S._tvHi ? lastH : S._tvHi;
    const span = visHi - visLo < 0.01 ? 0.01 : visHi - visLo;
    const mid = (visLo + visHi) * 0.5;
    const fade = n < 100 ? 1 - n * 0.01 : 0;
    const view = span * (1 + 0.5 * fade);
    const lo = mid - view * 0.5 - span * 0.08;
    const hi = mid + view * 0.5 + span * 0.08;

    const now = performance.now();
    const dt = Math.min(0.05, (now - (S._tapeT || now)) * 0.001);
    S._tapeT = now;
    if (S.tapeLo == null) {
      S.tapeLo = lo;
      S.tapeHi = hi;
    } else {
      const a = dt > 0 ? 1 - Math.exp(-dt / 6) : 0;
      if (lo < S.tapeLo) S.tapeLo = lo;
      else S.tapeLo += (lo - S.tapeLo) * a;
      if (hi > S.tapeHi) S.tapeHi = hi;
      else S.tapeHi += (hi - S.tapeHi) * a;
    }

    const rng = S.tapeHi - S.tapeLo;
    const inv = (y1 - y0) / (rng < 0.01 ? 0.01 : rng);
    const py = (v) => y1 - (v - S.tapeLo) * inv;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y0 - 12, S.W, y1 - y0 + 24);
    ctx.clip();
    const lastI = vis.length - 1;
    for (let i = 0; i < vis.length; i++) {
      const b = vis[i];
      const x = 10 + i * stepX - offsetX;
      if (x + cw < -4 || x > S.W + 4) continue;
      const h = i === lastI ? lastH : b.h;
      const l = i === lastI ? lastL : b.l;
      const c = i === lastI ? lastC : b.c;
      const bull = c >= b.o;
      ctx.strokeStyle = bull ? up : dn;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + cw * 0.5, py(h));
      ctx.lineTo(x + cw * 0.5, py(l));
      ctx.stroke();
      ctx.fillStyle = bull ? up : dn;
      const yO = py(b.o), yC = py(c);
      ctx.fillRect(x, yO < yC ? yO : yC, cw, Math.max(1.2, yO < yC ? yC - yO : yO - yC));
    }
    const marks = (S.tapeMarks || []).concat(S.tapeLive ? [S.tapeLive] : []);
    if (marks.length) {
      ctx.font = "700 8px \"IBM Plex Mono\", monospace";
      ctx.textAlign = "center";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(10,10,12,0.82)";
      for (const mk of marks) {
        const vi = ((mk.i || 0) / bucket | 0) - startB;
        if (vi < 0 || vi >= vis.length) continue;
        const peak = mk.kind === "peak";
        const x = 10 + vi * stepX + cw * 0.5 - offsetX;
        const y = py(mk.price) + (peak ? -5 : 5);
        ctx.textBaseline = peak ? "bottom" : "top";
        const lab = fmtUsd(mk.price);
        paintHaloText(ctx, lab, x, y, peak ? (PAL.labelUp || GREEN) : (PAL.labelDn || RED));
      }
    }
    ctx.restore();
  }


  const RIBBON_BAGS = Object.create(null);
  function ribbonBag(key) {
    return RIBBON_BAGS[key] || (RIBBON_BAGS[key] = {
      lastT: 0,
      init: false,
      segs: [
        { x: 0, y: 0, px: 0, py: 0, x2: 0, y2: 0, px2: 0, py2: 0 },
        { x: 0, y: 0, px: 0, py: 0, x2: 0, y2: 0, px2: 0, py2: 0 }
      ]
    });
  }
  function stepCloth(bag, attaches, v, time) {
    let dt = time - bag.lastT;
    if (!(dt > 0) || dt > 0.05) dt = 0.016;
    bag.lastT = time;
    const dt2 = dt * dt;
    const gY = 860 * dt2;
    const trail = -(v || 0) * dt * 0.7;
    if (!bag.init) {
      for (let i = 0; i < 2; i++) {
        const a = attaches[i];
        const s = bag.segs[i];
        s.x = a.x - a.len * 0.42;
        s.y = a.y + a.len * 0.62;
        s.px = s.x; s.py = s.y;
        s.x2 = a.x - a.len * 0.82;
        s.y2 = a.y + a.len * 1.05;
        s.px2 = s.x2; s.py2 = s.y2;
      }
      bag.init = true;
    }
    const pull = (ax, ay, bx, by, dist) => {
      const dx = bx - ax, dy = by - ay;
      const d = Math.hypot(dx, dy) || 0.001;
      const f = (d - dist) / d;
      return { x: bx - dx * f, y: by - dy * f };
    };
    for (let i = 0; i < 2; i++) {
      const a = attaches[i];
      const s = bag.segs[i];
      let vx = (s.x - s.px) * 0.86;
      let vy = (s.y - s.py) * 0.86;
      s.px = s.x; s.py = s.y;
      s.x += vx;
      s.y += vy + gY + trail;
      vx = (s.x2 - s.px2) * 0.86;
      vy = (s.y2 - s.py2) * 0.86;
      s.px2 = s.x2; s.py2 = s.y2;
      s.x2 += vx;
      s.y2 += vy + gY * 1.2 + trail * 1.15;
      const d1 = a.len * 0.5, d2 = a.len * 0.55;
      for (let k = 0; k < 4; k++) {
        let c = pull(a.x, a.y, s.x, s.y, d1);
        s.x = c.x; s.y = c.y;
        c = pull(s.x, s.y, s.x2, s.y2, d2);
        s.x2 = c.x; s.y2 = c.y;
      }
    }
  }

  function drawChoppyHero(ctx, r, v, t, wash, laser, worldX, skinId) {
    const sk = heroSkin(skinId || HERO_SKIN);
    const tilt = Math.max(-0.65, Math.min(0.95, (v || 0) * 0.0022));
    const g = Math.max(-1, Math.min(1, (v || 0) / 420));
    const time = t || 0;
    const gold = wash || (laser ? "#e8902a" : sk.fill);
    const rim = wash || (laser ? "#ffc878" : sk.rim);
    const ink = sk.ink;
    const btcInk = sk.btc;
    const red = wash || sk.band;
    const halo = sk.halo;
    const limbCol = sk.limb;
    const flat = sk.style === "flat";
    const rx = r * (flat ? 0.92 : 0.62);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const noodle = (ax, ay, ang, len, phase, col, colHalo) => {
      const sag = r * (0.22 + Math.max(0, g) * 0.42);
      const wig = Math.sin(time * 9.6 + phase) * r * 0.16;
      const flop = Math.sin(time * 6.3 + phase * 0.8) * r * 0.1;
      const ex = ax + Math.cos(ang) * len + flop;
      const ey = ay + Math.sin(ang) * len;
      const mx = (ax + ex) * 0.5 + wig;
      const my = (ay + ey) * 0.5 + sag;
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.stroke();
      };
      ctx.strokeStyle = colHalo || halo;
      ctx.lineWidth = Math.max(3, r * 0.22);
      path();
      ctx.strokeStyle = col || ink;
      ctx.lineWidth = Math.max(1.4, r * 0.11);
      path();
    };

    ctx.save();
    ctx.rotate(-tilt);
    const down = Math.PI / 2;
    const kickL = Math.sin(time * 8.9) * 0.5 + g * 0.7;
    const kickR = Math.sin(time * 8.9 + 2.5) * 0.5 + g * 0.55;
    const armL = Math.sin(time * 7.5 + 0.4) * 0.62 + g * 0.4;
    const armR = Math.sin(time * 7.5 + 2.7) * 0.62 + g * 0.34;
    noodle(-r * 0.12, r * 0.58, down + 0.42 + kickL, r * 1.28, 0.2, limbCol, halo);
    noodle(r * 0.14, r * 0.56, down - 0.12 + kickR, r * 1.22, 2.3, limbCol, halo);
    noodle(-rx * 0.85, r * 0.08, down + 1.05 + armL, r * 1.08, 1.2, limbCol, halo);
    noodle(rx * 0.85, r * 0.04, down - 1.12 + armR, r * 1.04, 3.0, limbCol, halo);
    ctx.restore();

    const thick = flat ? 0 : Math.max(3.2, r * 0.3);
    const dark = wash || sk.dark;
    const edge = wash || sk.edge;
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.ellipse(-thick, 0, rx, r, 0, Math.PI * 0.5, Math.PI * 1.5);
    ctx.lineTo(0, -r);
    ctx.ellipse(0, 0, rx, r, 0, -Math.PI * 0.5, Math.PI * 0.5, true);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = edge;
    ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, r, 0, 0, Math.PI * 2);
    ctx.fillStyle = gold;
    ctx.fill();
    ctx.strokeStyle = rim;
    ctx.lineWidth = Math.max(1.6, r * 0.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.84, r * 0.84, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(80,40,0,0.3)";
    ctx.lineWidth = Math.max(1.3, r * 0.08);
    ctx.stroke();

    ctx.save();
    ctx.translate(0, r * 0.06);
    ctx.transform(0.84, 0.03, -0.14, 0.97, 0, 0);
    ctx.fillStyle = btcInk;
    ctx.strokeStyle = "rgba(255,244,214,0.28)";
    ctx.lineWidth = Math.max(1.1, r * 0.05);
    ctx.font = "700 " + Math.round(r * 1.38) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText("₿", 0, 0);
    ctx.fillText("₿", 0, 0);
    ctx.restore();

    const lr = r * 0.21;
    const leftL = { x: rx * 0.32, y: -r * 0.16 };
    const rightL = { x: rx * 0.78, y: -r * 0.22 };
    if (!flat) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = Math.max(1.6, r * 0.1);
      ctx.beginPath();
      ctx.moveTo(leftL.x - lr * 0.7, leftL.y + lr * 0.04);
      ctx.lineTo(-rx * 0.52, leftL.y + r * 0.01);
      ctx.quadraticCurveTo(-rx * 1.04, leftL.y + r * 0.04, -rx * 1.12, leftL.y + r * 0.26);
      ctx.stroke();
      const lens = (c, rad, shade) => {
        ctx.beginPath();
        ctx.arc(c.x + rad * 0.14, c.y + rad * 0.12, rad, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(c.x, c.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = shade;
        ctx.fill();
        ctx.strokeStyle = "#111";
        ctx.lineWidth = Math.max(1.1, r * 0.07);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.arc(c.x - rad * 0.28, c.y - rad * 0.32, rad * 0.28, 0, Math.PI * 2);
        ctx.fill();
      };
      lens(rightL, lr * 0.86, sk.lensB);
      lens(leftL, lr, sk.lensF);
      ctx.strokeStyle = ink;
      ctx.lineWidth = Math.max(0.9, r * 0.055);
      ctx.beginPath();
      ctx.moveTo(leftL.x + lr * 0.72, leftL.y - lr * 0.08);
      ctx.lineTo(rightL.x - lr * 0.55, rightL.y + lr * 0.06);
      ctx.stroke();
    }

    const bandH = Math.max(3.2, r * 0.2);
    const bandY = -r * 0.56;
    const span = rx * Math.sqrt(Math.max(0, 1 - (bandY * bandY) / (r * r)));
    const leftA = Math.atan2(bandY, -span);
    const rightA = Math.atan2(bandY, span);
    ctx.save();
    ctx.lineCap = "butt";
    ctx.strokeStyle = red;
    ctx.lineWidth = bandH;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 1.02, r * 1.005, 0, leftA, rightA, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-thick, 0, rx * 1.02, r * 1.005, 0, leftA, Math.PI, true);
    ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = Math.max(1, bandH * 0.22);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 1.02, r * 1.005, 0, leftA, rightA, false);
    ctx.stroke();
    ctx.restore();

    const bandLeft = -thick - span;
    if (flat) {
      if (laser) {
        ctx.strokeStyle = wash || "rgba(255,150,40,0.78)";
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(rx * 0.92, -r * 0.08);
        ctx.lineTo((worldX != null ? (S.W - worldX + 80) : r * 12), -r * 0.16);
        ctx.moveTo(rx * 0.92, r * 0.08);
        ctx.lineTo((worldX != null ? (S.W - worldX + 80) : r * 12), r * 0.16);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    const bag = ribbonBag((ctx.canvas && ctx.canvas.id) || "c");
    const cs = Math.cos(tilt), sn = Math.sin(tilt);
    const toWorld = (x, y) => ({ x: x * cs - y * sn, y: x * sn + y * cs });
    const a0 = toWorld(bandLeft, bandY - bandH * 0.12);
    const a1 = toWorld(bandLeft, bandY + bandH * 0.18);
    a0.len = r * 1.18;
    a1.len = r * 0.98;
    stepCloth(bag, [a0, a1], v, time);
    ctx.save();
    ctx.rotate(-tilt);
    ctx.strokeStyle = red;
    ctx.lineWidth = Math.max(1.7, r * 0.13);
    for (let i = 0; i < 2; i++) {
      const a = i ? a1 : a0;
      const sg = bag.segs[i];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(sg.x, sg.y, sg.x2, sg.y2);
      ctx.stroke();
    }
    ctx.restore();

    if (laser) {
      ctx.strokeStyle = wash || "rgba(255,150,40,0.78)";
      ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.moveTo(leftL.x + lr, leftL.y - 2);
      ctx.lineTo((worldX != null ? (S.W - worldX + 80) : r * 12), leftL.y - 8);
      ctx.moveTo(rightL.x + lr * 0.4, rightL.y + 2);
      ctx.lineTo((worldX != null ? (S.W - worldX + 80) : r * 12), rightL.y + 8);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHeroLaser(ctx, x0, y0, worldX, r, wash) {
    ctx.strokeStyle = wash || "rgba(255,150,40,0.78)";
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(x0, y0 - 2);
    ctx.lineTo((worldX != null ? (S.W - worldX + 80) : r * 12), y0 - 8);
    ctx.moveTo(x0, y0 + 2);
    ctx.lineTo((worldX != null ? (S.W - worldX + 80) : r * 12), y0 + 8);
    ctx.stroke();
  }

  function drawRocketHero(ctx, r, v, t, wash, laser, worldX, anim) {
    const time = t || 0;
    const body = wash || "#9ec4ff";
    const dark = wash || "#3d5a90";
    const rim = wash || "#e8f0ff";
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    if (anim) ctx.rotate(Math.sin(time * 5.4) * 0.05);
    const boost = anim ? Math.max(0.75, Math.min(2.0, 1.1 - (v || 0) / 340)) : 0.42;
    const flick = anim ? 1 + Math.sin(time * 28) * 0.26 : 1;
    const fl = r * (anim ? 1.22 * boost * flick : 0.5);
    if (anim) {
      const fg = ctx.createRadialGradient(-r * 0.72, 0, r * 0.04, -r * 0.72, 0, fl + r * 0.45);
      fg.addColorStop(0, "rgba(255,245,190,0.95)");
      fg.addColorStop(0.28, "rgba(255,140,50,0.8)");
      fg.addColorStop(1, "rgba(255,40,20,0)");
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.ellipse(-r * 0.58 - fl * 0.28, 0, fl * 0.9, r * 0.46 * flick, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = wash || "#ff6a3a";
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.26);
    ctx.quadraticCurveTo(-r * 0.78 - fl, 0, -r * 0.5, r * 0.26);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = wash || "#ffe14a";
    ctx.beginPath();
    ctx.moveTo(-r * 0.48, -r * 0.14);
    ctx.quadraticCurveTo(-r * 0.58 - fl * (anim ? 0.72 : 0.45), 0, -r * 0.48, r * 0.14);
    ctx.closePath();
    ctx.fill();
    if (anim) {
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.moveTo(-r * 0.46, -r * 0.07);
      ctx.quadraticCurveTo(-r * 0.34 - fl * 0.4, 0, -r * 0.46, r * 0.07);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(4,16,40,0.38)";
      ctx.beginPath();
      ctx.moveTo(-r * 0.08, r * 0.22);
      ctx.lineTo(-r * 0.5, r * 0.9);
      ctx.lineTo(r * 0.16, r * 0.44);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-r * 0.08, -r * 0.22);
      ctx.lineTo(-r * 0.5, -r * 0.9);
      ctx.lineTo(r * 0.16, -r * 0.44);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, r * 0.26);
    ctx.lineTo(-r * 0.54, r * 0.82);
    ctx.lineTo(r * 0.12, r * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, -r * 0.26);
    ctx.lineTo(-r * 0.54, -r * 0.82);
    ctx.lineTo(r * 0.12, -r * 0.42);
    ctx.closePath();
    ctx.fill();
    if (anim) {
      const bg = ctx.createLinearGradient(0, -r * 0.48, 0, r * 0.48);
      bg.addColorStop(0, rim);
      bg.addColorStop(0.38, body);
      bg.addColorStop(1, dark);
      ctx.fillStyle = bg;
    } else {
      ctx.fillStyle = body;
    }
    ctx.strokeStyle = rim;
    ctx.lineWidth = Math.max(1.4, r * (anim ? 0.12 : 0.1));
    ctx.beginPath();
    ctx.moveTo(-r * 0.52, -r * 0.4);
    ctx.lineTo(r * 0.3, -r * 0.4);
    ctx.quadraticCurveTo(r * 1.18, 0, r * 0.3, r * 0.4);
    ctx.lineTo(-r * 0.52, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (anim) {
      ctx.fillStyle = "#041018";
      ctx.beginPath();
      ctx.ellipse(r * 0.16, -r * 0.02, r * 0.2, r * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rim;
      ctx.lineWidth = Math.max(1, r * 0.06);
      ctx.stroke();
      ctx.fillStyle = "rgba(210,235,255,0.5)";
      ctx.beginPath();
      ctx.ellipse(r * 0.1, -r * 0.08, r * 0.08, r * 0.1, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(4,16,24,0.28)";
      ctx.lineWidth = Math.max(1, r * 0.06);
      ctx.beginPath();
      ctx.ellipse(-r * 0.08, 0, r * 0.14, r * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = wash || "#f4f8ff";
    ctx.font = "700 " + Math.round(r * (anim ? 0.86 : 0.92)) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("₿", anim ? r * 0.16 : r * 0.04, 1);
    if (laser) drawHeroLaser(ctx, r * 0.92, 0, worldX, r, wash);
    ctx.restore();
  }

  function drawPencilHero(ctx, r, v, t, wash, laser, worldX, anim) {
    const time = t || 0;
    const yellow = wash || "#e6c24a";
    const wood = wash || "#d4a06a";
    const ink = "#1a1610";
    ctx.save();
    if (anim) ctx.rotate(Math.sin(time * 6.4) * 0.08);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    if (anim) {
      ctx.fillStyle = "rgba(26,22,16,0.16)";
      ctx.beginPath();
      ctx.ellipse(r * 0.05, r * 0.42, r * 1.05, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = wash || "#e07a8a";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-r * 1.12, -r * (anim ? 0.32 : 0.28), r * 0.36, r * (anim ? 0.64 : 0.56), r * 0.14);
    else ctx.rect(-r * 1.12, -r * 0.28, r * 0.36, r * 0.56);
    ctx.fill();
    if (anim) {
      ctx.fillStyle = "rgba(255,220,220,0.35)";
      ctx.beginPath();
      ctx.ellipse(-r * 0.96, -r * 0.1, r * 0.08, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#c8ccd0";
    ctx.fillRect(-r * 0.8, -r * (anim ? 0.32 : 0.3), r * (anim ? 0.2 : 0.16), r * (anim ? 0.64 : 0.6));
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1.1, r * 0.07);
    ctx.strokeRect(-r * 0.8, -r * (anim ? 0.32 : 0.3), r * (anim ? 0.2 : 0.16), r * (anim ? 0.64 : 0.6));
    if (anim) {
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-r * 0.76, -r * 0.18);
      ctx.lineTo(-r * 0.64, -r * 0.18);
      ctx.stroke();
      ctx.strokeStyle = ink;
    }
    if (anim) {
      const faces = 6;
      for (let i = 0; i < faces; i++) {
        const y0 = -r * 0.32 + (i / faces) * r * 0.64;
        const y1 = -r * 0.32 + ((i + 1) / faces) * r * 0.64;
        ctx.fillStyle = i % 2 ? yellow : "#d4ad3a";
        ctx.fillRect(-r * 0.64, y0, r * 1.02, y1 - y0 + 0.4);
      }
      ctx.strokeStyle = ink;
      ctx.lineWidth = Math.max(1.1, r * 0.07);
      ctx.strokeRect(-r * 0.64, -r * 0.32, r * 1.02, r * 0.64);
      ctx.strokeStyle = "rgba(26,22,16,0.22)";
      ctx.lineWidth = 1;
      for (let i = 1; i < faces; i++) {
        const y = -r * 0.32 + (i / faces) * r * 0.64;
        ctx.beginPath();
        ctx.moveTo(-r * 0.64, y);
        ctx.lineTo(r * 0.38, y);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = yellow;
      ctx.beginPath();
      ctx.rect(-r * 0.64, -r * 0.3, r * 1.02, r * 0.6);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = wood;
    ctx.beginPath();
    ctx.moveTo(r * 0.38, -r * (anim ? 0.32 : 0.3));
    ctx.lineTo(r * 0.98, 0);
    ctx.lineTo(r * 0.38, r * (anim ? 0.32 : 0.3));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.stroke();
    if (anim) {
      ctx.strokeStyle = "rgba(90,50,20,0.35)";
      ctx.beginPath();
      ctx.moveTo(r * 0.46, -r * 0.16);
      ctx.lineTo(r * 0.82, 0);
      ctx.moveTo(r * 0.46, r * 0.16);
      ctx.lineTo(r * 0.82, 0);
      ctx.stroke();
    }
    ctx.fillStyle = "#2a241c";
    ctx.beginPath();
    ctx.moveTo(r * 0.76, -r * 0.1);
    ctx.lineTo(r * 1.14, 0);
    ctx.lineTo(r * 0.76, r * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = "700 " + Math.round(r * 0.7) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("₿", -r * 0.12, 1);
    if (anim) {
      ctx.strokeStyle = "rgba(26,22,16,0.55)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(r * 1.14, 0);
      ctx.quadraticCurveTo(r * 1.4, Math.sin(time * 9) * r * 0.2, r * 1.85, Math.sin(time * 7) * r * 0.32);
      ctx.stroke();
      ctx.strokeStyle = "rgba(26,22,16,0.22)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(r * 1.16, 2);
      ctx.quadraticCurveTo(r * 1.46, Math.sin(time * 8.2) * r * 0.16, r * 1.7, Math.sin(time * 6.1) * r * 0.24);
      ctx.stroke();
    }
    if (laser) drawHeroLaser(ctx, r * 1.08, 0, worldX, r, wash);
    ctx.restore();
  }

  function drawFlowerHero(ctx, r, v, t, wash, laser, worldX, anim) {
    const time = t || 0;
    const pink = wash || "#ff4aa8";
    const gold = wash || "#ffe14a";
    const lime = wash || "#7dff6a";
    const center = wash || "#fff4c8";
    const ink = "#2a0838";
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    if (anim) {
      ctx.strokeStyle = lime;
      ctx.lineWidth = Math.max(2.2, r * 0.16);
      const sag = Math.max(0, (v || 0) * 0.05);
      ctx.beginPath();
      ctx.moveTo(0, r * 0.18);
      ctx.quadraticCurveTo(-r * 0.42, r * 1.15 + sag, Math.sin(time * 4.4) * r * 0.22, r * 2.45);
      ctx.stroke();
    }
    const n = anim ? 8 : 6;
    for (let i = 0; i < n; i++) {
      const a = i * Math.PI * 2 / n + 0.18 + (anim ? Math.sin(time * 3.1 + i) * 0.14 : 0);
      const stretch = anim ? 1 + Math.sin(time * 4.2 + i * 0.8) * 0.14 - Math.max(-0.08, Math.min(0.18, (v || 0) / 900)) : 1;
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = i % 2 ? pink : gold;
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.7 * stretch, r * 0.3, r * 0.52 * stretch, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = center;
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1.4, r * 0.08);
    ctx.stroke();
    ctx.fillStyle = "#6a2880";
    ctx.font = "700 " + Math.round(r * 0.72) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("₿", 0, 1);
    if (laser) drawHeroLaser(ctx, r * 0.5, -2, worldX, r, wash);
    ctx.restore();
  }

  function drawThemedOrb(ctx, r, wash, laser, worldX, skinId) {
    const sk = heroSkin(skinId);
    const fill = wash || (laser ? "#e8902a" : sk.fill);
    if (sk.glow) {
      const gg = ctx.createRadialGradient(0, 0, r * 0.15, 0, 0, r * 1.55);
      gg.addColorStop(0, sk.glow);
      gg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(0, 0, r * 1.55, 0, Math.PI * 2); ctx.fill();
    }
    if (sk.style === "petal") {
      ctx.fillStyle = wash || sk.band;
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3 + 0.2;
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72, r * 0.4, r * 0.22, a, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = fill;
    ctx.strokeStyle = sk.rim;
    ctx.lineWidth = sk.style === "ink" ? 2.8 : sk.style === "flat" ? 2.2 : 2;
    ctx.beginPath();
    if (sk.style === "pixel") {
      const s = r * 1.15;
      if (ctx.roundRect) ctx.roundRect(-s / 2, -s / 2, s, s, 3);
      else ctx.rect(-s / 2, -s / 2, s, s);
    } else {
      ctx.arc(0, 0, r, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();
    if (sk.style === "moon") {
      ctx.fillStyle = palRgba(sk.dark, 0.45);
      ctx.beginPath();
      ctx.arc(r * 0.22, -r * 0.1, r * 0.72, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = sk.btc;
    ctx.font = "700 " + Math.round(r * 1.12) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(sk.mark, 0, 1);
    if (laser) {
      ctx.strokeStyle = wash || "rgba(255,150,40,0.78)";
      ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.moveTo(r - 2, -3);
      ctx.lineTo((worldX != null ? (S.W - worldX + 80) : r * 12), -8);
      ctx.moveTo(r - 2, 3);
      ctx.lineTo((worldX != null ? (S.W - worldX + 80) : r * 12), 8);
      ctx.stroke();
    }
  }

  function heroDrawR(r, st, anim) {
    if (st === "rocket") return r * (anim ? 1.14 : 1.04);
    if (st === "pencil") return r * (anim ? 1.08 : 0.98);
    if (st === "hippie") return r * 0.8;
    if (st === "pixel") return r * 0.92;
    if (anim) return r * 0.78;
    return r;
  }
  function drawBirdAt(ctx, x, y, v, r, hero, wash, alpha, laser, choppy, skinId) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.translate(x, y);
    ctx.rotate(Math.max(-0.65, Math.min(0.95, (v || 0) * 0.0022)));
    const skin = skinId || HERO_SKIN;
    const st = heroSkin(skin).style;
    const now = performance.now() * 0.001;
    const vis = heroDrawR(r, st, !!choppy);
    if (st === "rocket") {
      drawRocketHero(ctx, vis, v, now, wash, laser, x, !!choppy);
      ctx.restore();
      return;
    }
    if (st === "pencil") {
      drawPencilHero(ctx, vis, v, now, wash, laser, x, !!choppy);
      ctx.restore();
      return;
    }
    if (st === "hippie") {
      drawFlowerHero(ctx, vis, v, now, wash, laser, x, !!choppy);
      ctx.restore();
      return;
    }
    if (choppy) {
      drawChoppyHero(ctx, vis, v, now, wash, laser, x, skin);
      ctx.restore();
      return;
    }
    if (!S.mp || skinId) {
      drawThemedOrb(ctx, r, wash, laser, x, skin);
      ctx.restore();
      return;
    }
    const col = wash || (laser ? "#e8902a" : (hero && hero.fill) || BTC);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = (hero && hero.ring) || "#09090b";
    ctx.lineWidth = 2; ctx.stroke();
    if (hero) drawHeroMark(ctx, hero, r);
    else {
      ctx.fillStyle = "#09090b";
      ctx.font = "700 " + Math.round(r) + "px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("B", 0, 1);
    }
    if (laser) {
      ctx.strokeStyle = wash || "rgba(255,150,40,0.78)"; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(r - 2, -3); ctx.lineTo(S.W - x + 80, -8);
      ctx.moveTo(r - 2, 3); ctx.lineTo(S.W - x + 80, 8); ctx.stroke();
    }
    ctx.restore();
  }

  function hashU(n) {
    n = Math.imul(n ^ (n >>> 16), 2246822519);
    n = Math.imul(n ^ (n >>> 13), 3266489917);
    return (n ^ (n >>> 16)) >>> 0;
  }
  let STAR_CACHE = null;
  let STAR_CACHE_KEY = "";
  let FLOWER_CACHE = null;
  let FLOWER_CACHE_KEY = "";
  function starsFor(w, h, n) {
    const key = w + "x" + h + ":" + n;
    if (STAR_CACHE && STAR_CACHE_KEY === key) return STAR_CACHE;
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = hashU((i + 1) * 2654435761);
      const b = hashU((i + 19) * 1597334677);
      const c = hashU((i + 41) * 374761393);
      out.push({
        x: (a % 10007) / 10007 * w,
        y: (b % 10009) / 10009 * h * 0.8,
        r: 0.35 + (c % 90) / 90 * 1.7,
        a: 0.16 + (c % 70) / 180
      });
    }
    STAR_CACHE = out;
    STAR_CACHE_KEY = key;
    return out;
  }
  function flowersFor(w, h) {
    const key = w + "x" + h + ":v4";
    if (FLOWER_CACHE && FLOWER_CACHE_KEY === key) return FLOWER_CACHE;
    const bird = Math.min(17, Math.max(13, (S.H || h) * 0.021));
    const heroD = bird * 2;
    const minR = heroD * 2.8 * 0.5;
    const kinds = [
      { petals: 11, shape: "ellipse", tex: "silk", layers: 2, hue: 318, sat: 68, lite: 60, alpha: 0.5, size: 3.7, squash: 0.88, skew: 0.1, tilt: 0.16, center: "gold", shift: 12, x: 0.5, y: 0.46, blend: "source-over" },
      { petals: 6, shape: "heart", tex: "ruffle", layers: 1, hue: 344, sat: 42, lite: 80, alpha: 0.78, size: 2.35, squash: 0.94, skew: 0.06, tilt: -0.18, center: "cream", shift: 4, x: 0.16, y: 0.2, blend: "source-over" },
      { petals: 22, shape: "thin", tex: "silk", layers: 1, hue: 48, sat: 96, lite: 56, alpha: 0.22, size: 3.1, squash: 0.42, skew: -0.4, tilt: 0.7, center: "dark", shift: 2, x: 0.82, y: 0.12, blend: "lighter" },
      { petals: 7, shape: "pointed", tex: "vein", layers: 1, hue: 10, sat: 84, lite: 50, alpha: 0.7, size: 2.15, squash: 0.86, skew: 0.14, tilt: 0.38, center: "gold", shift: 7, x: 0.14, y: 0.62, blend: "source-over" },
      { petals: 9, shape: "notch", tex: "spots", layers: 2, hue: 164, sat: 52, lite: 44, alpha: 0.52, size: 2.5, squash: 0.62, skew: 0.3, tilt: -0.48, center: "lime", shift: 22, x: 0.86, y: 0.38, blend: "source-over" },
      { petals: 4, shape: "wide", tex: "glow", layers: 1, hue: 26, sat: 100, lite: 62, alpha: 0.28, size: 2.9, squash: 0.4, skew: 0.48, tilt: -0.85, center: "gold", shift: 18, x: 0.78, y: 0.7, blend: "lighter" },
      { petals: 16, shape: "ellipse", tex: "silk", layers: 2, hue: 274, sat: 40, lite: 34, alpha: 0.62, size: 2.2, squash: 0.76, skew: -0.14, tilt: 0.2, center: "magenta", shift: 5, x: 0.32, y: 0.82, blend: "source-over" },
      { petals: 8, shape: "teardrop", tex: "ragged", layers: 1, hue: 198, sat: 22, lite: 78, alpha: 0.42, size: 2.45, squash: 0.58, skew: -0.32, tilt: 0.9, center: "cream", shift: 11, x: 0.62, y: 0.78, blend: "source-over" },
      { petals: 12, shape: "pointed", tex: "stripes", layers: 1, hue: 318, sat: 70, lite: 54, alpha: 0.36, size: 2.6, squash: 0.5, skew: 0.36, tilt: 0.55, center: "dark", shift: 9, x: 0.28, y: 0.08, blend: "source-over" },
      { petals: 8, shape: "ellipse", tex: "spots", layers: 1, hue: 78, sat: 64, lite: 46, alpha: 0.58, size: 2.05, squash: 0.84, skew: -0.08, tilt: -0.28, center: "lime", shift: 30, x: 0.88, y: 0.88, blend: "source-over" },
      { petals: 5, shape: "wide", tex: "ruffle", layers: 1, hue: 352, sat: 54, lite: 28, alpha: 0.76, size: 2.3, squash: 0.7, skew: 0.22, tilt: 0.08, center: "dark", shift: 8, x: 0.08, y: 0.88, blend: "source-over" },
      { petals: 9, shape: "heart", tex: "vein", layers: 1, hue: 290, sat: 58, lite: 66, alpha: 0.44, size: 2.7, squash: 0.8, skew: -0.2, tilt: -0.4, center: "magenta", shift: 16, x: 0.68, y: 0.28, blend: "source-over" }
    ];
    const out = [];
    for (let i = 0; i < kinds.length; i++) {
      const k = kinds[i];
      const a = hashU((i + 203) * 2654435761);
      const b = hashU((i + 71) * 1597334677);
      out.push({
        x: (k.x + ((a % 900) / 900 - 0.5) * 0.03) * w,
        y: (k.y + ((b % 900) / 900 - 0.5) * 0.03) * h,
        r: minR * k.size,
        petals: k.petals,
        shape: k.shape,
        layers: k.layers,
        tilt: k.tilt,
        squash: k.squash,
        skew: k.skew,
        hue: k.hue,
        sat: k.sat,
        lite: k.lite,
        alpha: k.alpha,
        tex: k.tex,
        center: k.center,
        shift: k.shift,
        blend: k.blend,
        seed: a >>> 0
      });
    }
    FLOWER_CACHE = out;
    FLOWER_CACHE_KEY = key;
    return out;
  }
  function drawBgFlower(ctx, fl, t) {
    ctx.save();
    ctx.translate(fl.x, fl.y);
    ctx.rotate(fl.tilt + Math.sin(t * (0.1 + (fl.seed % 13) * 0.018) + fl.seed) * (0.025 + (fl.seed % 7) * 0.008));
    ctx.transform(1, fl.skew * 0.64, fl.skew * 0.32, fl.squash, 0, 0);
    ctx.globalAlpha = fl.alpha;
    ctx.globalCompositeOperation = fl.blend || "source-over";
    const n = fl.petals;
    const r = fl.r;
    const tex = fl.tex;
    const shape = fl.shape || "ellipse";
    const layers = fl.layers || 1;
    const petalPath = (pr, pw, twist) => {
      ctx.beginPath();
      if (shape === "heart") {
        ctx.moveTo(0, -pr * 0.12);
        ctx.bezierCurveTo(-pw * 1.35, -pr * 0.52, -pw * 0.18, -pr * 1.08, 0, -pr * 0.86);
        ctx.bezierCurveTo(pw * 0.18, -pr * 1.08, pw * 1.35, -pr * 0.52, 0, -pr * 0.12);
      } else if (shape === "pointed") {
        ctx.moveTo(0, r * 0.02);
        ctx.quadraticCurveTo(-pw * 1.2, -pr * 0.3, 0, -pr);
        ctx.quadraticCurveTo(pw * 1.2, -pr * 0.3, 0, r * 0.02);
      } else if (shape === "teardrop") {
        ctx.moveTo(0, r * 0.04);
        ctx.bezierCurveTo(-pw * 1.1, -pr * 0.18, -pw * 0.42, -pr * 0.82, 0, -pr * 1.04);
        ctx.bezierCurveTo(pw * 0.42, -pr * 0.82, pw * 1.1, -pr * 0.18, 0, r * 0.04);
      } else if (shape === "notch") {
        ctx.moveTo(0, -r * 0.04);
        ctx.quadraticCurveTo(-pw, -pr * 0.32, -pw * 0.58, -pr * 0.8);
        ctx.lineTo(0, -pr * 0.52);
        ctx.lineTo(pw * 0.58, -pr * 0.8);
        ctx.quadraticCurveTo(pw, -pr * 0.32, 0, -r * 0.04);
      } else if (shape === "wide") {
        ctx.ellipse(0, -pr * 0.36, pw * 1.4, pr * 0.4, twist * 0.18, 0, Math.PI * 2);
      } else if (shape === "thin") {
        ctx.ellipse(0, -pr * 0.52, pw * 0.5, pr * 0.56, twist * 0.12, 0, Math.PI * 2);
      } else if (tex === "ruffle") {
        ctx.moveTo(0, -r * 0.06);
        for (let k = 0; k <= 10; k++) {
          const u = k / 10;
          const ang = -Math.PI * 0.5 + (u - 0.5) * 1.7;
          const scallop = 1 + Math.sin(u * Math.PI * 5) * 0.16;
          ctx.lineTo(Math.cos(ang) * pw * 1.2 * scallop, -pr * 0.1 + Math.sin(ang) * pr * 0.92 * scallop);
        }
        ctx.closePath();
      } else if (tex === "ragged") {
        ctx.moveTo(0, -r * 0.06);
        ctx.quadraticCurveTo(-pw * 1.15, -pr * 0.32, -pw * 0.5, -pr * 0.86);
        ctx.quadraticCurveTo(0, -pr * 1.12, pw * 0.42, -pr * 0.68);
        ctx.quadraticCurveTo(pw * 1.05, -pr * 0.26, 0, -r * 0.06);
      } else {
        ctx.ellipse(0, -pr * 0.5, pw, pr * 0.52, twist * 0.35, 0, Math.PI * 2);
      }
    };
    for (let layer = layers - 1; layer >= 0; layer--) {
      const scale = 1 - layer * 0.3;
      for (let p = 0; p < n; p++) {
        const twist = (((fl.seed >>> (p * 2 + layer)) & 15) / 15 - 0.5) * (tex === "ragged" ? 0.62 : 0.2);
        const stretch = (shape === "thin" ? 1.02 : 0.76) + ((fl.seed >>> (p * 3)) & 7) / 7 * (shape === "thin" ? 0.1 : 0.44);
        const fat = shape === "thin" ? 0.09 : shape === "wide" ? 0.5 : tex === "silk" ? 0.17 : 0.25 + ((fl.seed >>> p) & 3) * 0.05;
        const pa = p * Math.PI * 2 / n + twist + layer * 0.2 + (tex === "ragged" ? p * 0.08 : 0);
        ctx.save();
        ctx.rotate(pa);
        const pr = r * stretch * scale;
        const pw = r * fat * scale;
        const hue = (fl.hue + p * fl.shift + layer * 16) % 360;
        const sat = Math.max(6, fl.sat - layer * 12);
        const lite = fl.lite + layer * 8;
        const g = ctx.createRadialGradient(0, -pr * 0.16, r * 0.03, 0, -pr * 0.48, pr);
        if (tex === "silk") {
          g.addColorStop(0, "hsla(" + hue + "," + sat + "%," + Math.min(94, lite + 26) + "%,0.82)");
          g.addColorStop(0.5, "hsla(" + hue + "," + sat + "%," + lite + "%,0.4)");
          g.addColorStop(1, "hsla(" + hue + "," + Math.max(8, sat - 28) + "%," + (lite - 16) + "%,0.03)");
        } else if (tex === "glow") {
          g.addColorStop(0, "hsla(" + hue + ",100%,88%,0.78)");
          g.addColorStop(0.4, "hsla(" + ((hue + 30) % 360) + ",92%,58%,0.32)");
          g.addColorStop(1, "hsla(" + hue + ",80%,48%,0)");
        } else {
          g.addColorStop(0, "hsla(" + hue + "," + sat + "%," + Math.min(92, lite + 18) + "%,0.95)");
          g.addColorStop(0.42, "hsla(" + hue + "," + sat + "%," + lite + "%,0.76)");
          g.addColorStop(1, "hsla(" + ((hue + 40) % 360) + "," + Math.max(10, sat - 20) + "%," + (lite - 14) + "%,0.07)");
        }
        ctx.fillStyle = g;
        petalPath(pr, pw, twist);
        ctx.fill();
        if (tex === "vein") {
          ctx.strokeStyle = "hsla(" + hue + ",38%,96%,0.42)";
          ctx.lineWidth = Math.max(0.7, r * 0.02);
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.06);
          ctx.quadraticCurveTo(pw * 0.14, -pr * 0.4, 0, -pr * 0.92);
          ctx.stroke();
          ctx.strokeStyle = "hsla(" + hue + ",28%,18%,0.14)";
          ctx.beginPath();
          ctx.moveTo(-pw * 0.28, -pr * 0.25);
          ctx.quadraticCurveTo(-pw * 0.08, -pr * 0.5, -pw * 0.1, -pr * 0.75);
          ctx.stroke();
        }
        if (tex === "stripes") {
          ctx.strokeStyle = "hsla(" + ((hue + 52) % 360) + ",42%,26%,0.32)";
          ctx.lineWidth = Math.max(1, r * 0.026);
          for (let s = 0; s < 4; s++) {
            const yy = -pr * (0.2 + s * 0.16);
            ctx.beginPath();
            ctx.ellipse(0, yy, pw * (0.72 - s * 0.1), pr * 0.045, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        if (tex === "spots") {
          ctx.fillStyle = "hsla(" + ((hue + 168) % 360) + ",32%,94%,0.4)";
          const spots = 4 + (p % 4);
          for (let s = 0; s < spots; s++) {
            const sx = ((((fl.seed >>> (s + p * 3)) & 15) / 15) - 0.5) * pw * 1.05;
            const sy = -pr * (0.18 + ((fl.seed >>> (s * 2 + p)) & 7) / 11);
            ctx.beginPath();
            ctx.ellipse(sx, sy, r * (0.032 + (s % 4) * 0.018), r * 0.026, pa, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        if (tex === "ruffle") {
          ctx.strokeStyle = "hsla(" + hue + ",30%,96%,0.26)";
          ctx.lineWidth = Math.max(0.6, r * 0.016);
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.08);
          ctx.quadraticCurveTo(pw * 0.2, -pr * 0.42, 0, -pr * 0.88);
          ctx.stroke();
        }
        ctx.restore();
      }
    }
    ctx.globalCompositeOperation = "source-over";
    const centers = {
      gold: ["rgba(255,250,210,0.95)", "rgba(255,210,60,0.9)", "rgba(180,60,160,0.5)"],
      dark: ["rgba(28,6,36,0.92)", "rgba(70,16,90,0.78)", "rgba(12,2,18,0.65)"],
      lime: ["rgba(236,255,170,0.92)", "rgba(90,200,50,0.84)", "rgba(24,70,28,0.48)"],
      magenta: ["rgba(255,190,220,0.9)", "rgba(200,50,140,0.82)", "rgba(70,12,60,0.5)"],
      cream: ["rgba(255,255,246,0.96)", "rgba(255,236,198,0.78)", "rgba(190,150,110,0.4)"]
    };
    const cc = centers[fl.center] || centers.gold;
    const cg = ctx.createRadialGradient(-r * 0.1, -r * 0.1, r * 0.02, 0, 0, r * (shape === "thin" ? 0.2 : 0.34));
    cg.addColorStop(0, cc[0]);
    cg.addColorStop(0.45, cc[1]);
    cg.addColorStop(1, cc[2]);
    ctx.fillStyle = cg;
    ctx.beginPath();
    const crx = r * (fl.center === "dark" ? 0.2 : shape === "thin" ? 0.16 : 0.3);
    const cry = r * (fl.center === "dark" ? 0.14 : 0.22);
    ctx.ellipse(0, 0, crx, cry, fl.skew * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = fl.center === "dark" ? "rgba(255,220,120,0.32)" : "rgba(70,16,90,0.28)";
    const dots = fl.center === "cream" ? 5 : fl.center === "dark" ? 18 : 12;
    for (let d = 0; d < dots; d++) {
      const ang = d * 2.399 + (fl.seed % 13) * 0.15;
      const rr = r * (0.03 + (d % 6) * 0.03);
      ctx.beginPath();
      ctx.ellipse(Math.cos(ang) * rr, Math.sin(ang) * rr * 0.62, r * (0.018 + (d % 3) * 0.008), r * 0.014, ang, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawWorldBg(ctx, wash, w, h) {
    w = w || S.W;
    h = h || S.H;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, PAL.bgTop || PAL.bg);
    g.addColorStop(0.52, PAL.bg);
    g.addColorStop(1, PAL.bgBot || PAL.bg);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const id = PALETTE_ID;
    if (id === "midnight" || id === "neon") {
      const stars = starsFor(w, h, id === "midnight" ? 72 : 48);
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        ctx.fillStyle = palRgba(PAL.fg, st.a);
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (id === "sunset") {
      const cx = w * 0.78, cy = h * 0.2, rad = Math.max(70, h * 0.16);
      const sun = ctx.createRadialGradient(cx, cy, 6, cx, cy, rad);
      sun.addColorStop(0, palRgba("#ffd0a0", 0.95));
      sun.addColorStop(0.18, palRgba(PAL.gold, 0.72));
      sun.addColorStop(0.48, palRgba(PAL.gold, 0.16));
      sun.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = palRgba(PAL.gold, 0.14);
      ctx.fillRect(0, cy + 10, w, 3);
    }
    if (id === "midnight") {
      const cx = w * 0.78, cy = h * 0.2, rad = Math.max(70, h * 0.16);
      const moonR = Math.max(15, h * 0.036);
      const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, rad);
      glow.addColorStop(0, palRgba("#e8eefc", 0.7));
      glow.addColorStop(0.2, palRgba(PAL.gold, 0.28));
      glow.addColorStop(0.55, palRgba(PAL.gold, 0.08));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#eef3ff";
      ctx.beginPath();
      ctx.arc(cx, cy, moonR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = palRgba("#c5d2ee", 0.55);
      ctx.beginPath();
      ctx.arc(cx - moonR * 0.22, cy + moonR * 0.12, moonR * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + moonR * 0.28, cy - moonR * 0.2, moonR * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + moonR * 0.08, cy + moonR * 0.32, moonR * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }
    if (id === "neon") {
      const a = ctx.createRadialGradient(w * 0.18, h * 0.12, 2, w * 0.18, h * 0.12, 170);
      a.addColorStop(0, palRgba(PAL.gold, 0.34));
      a.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = a;
      ctx.fillRect(0, 0, w, h);
      const b = ctx.createRadialGradient(w * 0.88, h * 0.78, 2, w * 0.88, h * 0.78, 190);
      b.addColorStop(0, palRgba(PAL.green, 0.22));
      b.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = b;
      ctx.fillRect(0, 0, w, h);
    }
    if (id === "terminal") {
      ctx.fillStyle = palRgba(PAL.gold, 0.05);
      for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.2, w * 0.5, h * 0.5, h * 0.74);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.38)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    }
    if (id === "flower") {
      const tnow = performance.now() * 0.001;
      for (let i = 6; i >= 0; i--) {
        const rad = 36 + i * 38 + Math.sin(tnow * 0.7 + i) * 8;
        ctx.beginPath();
        ctx.arc(w * 0.5 + Math.cos(tnow * 0.35) * 18, h * 0.42 + Math.sin(tnow * 0.28) * 12, rad, 0, Math.PI * 2);
        ctx.strokeStyle = "hsla(" + ((tnow * 48 + i * 52) % 360) + ",85%,62%,0.14)";
        ctx.lineWidth = 10;
        ctx.stroke();
      }
      const blooms = flowersFor(w, h);
      for (let i = 0; i < blooms.length; i++) drawBgFlower(ctx, blooms[i], tnow);
    }
    if (id === "paper") {
      ctx.strokeStyle = palRgba(PAL.line, 0.7);
      ctx.lineWidth = 1;
      for (let y = 22; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(w - 8, y);
        ctx.stroke();
      }
      ctx.strokeStyle = palRgba(PAL.red, 0.24);
      ctx.beginPath();
      ctx.moveTo(40, 0);
      ctx.lineTo(40, h);
      ctx.stroke();
    } else if (id !== "simple") {
      ctx.strokeStyle = wash ? palRgba(wash, 0.38) : PAL.grid;
      ctx.lineWidth = 1;
      const stepG = id === "terminal" ? 28 : 36;
      const ox = -(((S.bg || 0) * 0.5) % stepG);
      for (let x = ox; x < w + stepG; x += stepG) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += stepG) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }
    if (S.power === "BULL") {
      ctx.fillStyle = palRgba(PAL.green, 0.16);
      ctx.fillRect(0, 0, w, h);
    } else if (S.power === "BEAR") {
      ctx.fillStyle = palRgba(PAL.red, 0.16);
      ctx.fillRect(0, 0, w, h);
    }
  }

  function draw(ctx) {
    const wash = S.power === "BULL" ? GREEN : S.power === "BEAR" ? RED : null;
    drawWorldBg(ctx, wash);
    drawTape(ctx, S.tape, S.H * 0.196, S.H * 0.804, palRgba(GREEN, 0.58), palRgba(RED, 0.58));

    const m = metrics();
    const pw = pipePw();
    const endingFlash = S.power === "BULL" && S.powerT < 1.15 && Math.floor(S.powerT * 9) % 2 === 0;
    const edge = wash || (S.laserOn ? "#e8902a" : palRgba(PAL.fg, 0.85));
    for (const p of S.pipes) {
      const col = endingFlash ? RED : wash || (p.green ? GREEN : RED);
      const ends = pipeEnds(p);
      const wx = pipeWx(p, pw);
      p.wx = wx;
      if (p.finish) {
        ctx.save();
        const stripe = 12;
        for (let y = 0; y < S.H; y += stripe) {
          ctx.fillStyle = ((y / stripe) | 0) % 2 === 0 ? PAL.fg : PAL.ink;
          ctx.fillRect(p.x, y, Math.max(10, pw * 0.42), stripe);
        }
        ctx.fillStyle = BTC;
        ctx.fillRect(p.x - 3, 0, 5, S.H);
        ctx.fillStyle = PAL.hud;
        ctx.font = "700 13px \"IBM Plex Mono\", monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(t("mpRace").toUpperCase(), p.x + pw * 0.2, 10);
        ctx.restore();
        continue;
      }
      ctx.fillStyle = col; ctx.strokeStyle = edge; ctx.lineWidth = S.laserOn ? 2.4 : 1.6;
      ctx.fillRect(p.x, 0, pw, ends.top); ctx.strokeRect(p.x + 0.5, 0.5, pw - 1, Math.max(0, ends.top - 1));
      ctx.fillRect(p.x, ends.bot, pw, S.H - ends.bot); ctx.strokeRect(p.x + 0.5, ends.bot + 0.5, pw - 1, Math.max(0, S.H - ends.bot - 1));
      const wick = Math.min(22, p.gapH * 0.14);
      ctx.beginPath(); ctx.strokeStyle = wash ? wash : S.laserOn ? "rgba(232,144,42,0.75)" : palRgba(PAL.fg, 0.5); ctx.lineWidth = 2;
      ctx.moveTo(wx, ends.top); ctx.lineTo(wx, ends.top + wick); ctx.moveTo(wx, ends.bot); ctx.lineTo(wx, ends.bot - wick); ctx.stroke();
    }
    for (const it of S.items) {
      const p = it.pipe && S.pipes.indexOf(it.pipe) >= 0 ? it.pipe : null;
      if (p && !it.freeX) it.x = p.wx;
      drawPowerIcon(ctx, it, wash);
    }
    const blink = S.invuln > 0 && Math.floor(S.invuln * 10) % 2 === 0;
    const foc = S.mp ? mpFocusPlayer() : null;
    const mineId = window.ChoppyMP && window.ChoppyMP.id ? window.ChoppyMP.id() : null;
    const selfGhost = !!(S.mp && (S.spectate || S.dead || S.finished) && foc && foc.id !== mineId);
    if (!blink && !selfGhost) drawBirdAt(ctx, S.bird.x, S.bird.y, S.bird.v, S.bird.r, myHero(), wash, 1, S.laserOn, HERO_ANIM, HERO_SKIN);
    if (S.mp && window.ChoppyMP) {
      (window.ChoppyMP.players() || []).forEach((p) => {
        if (!p || p.id === mineId) return;
        if (p.x == null || p.y == null) return;
        const h = heroOf(p.slot || 0);
        const lead = foc && p.id === foc.id;
        const gone = p.alive === false && !p.finished;
        if (gone && !lead) return;
        if (p._gx == null) { p._gx = p.x; p._gy = p.y; }
        else {
          p._gx += (p.x - p._gx) * 0.28;
          p._gy += (p.y - p._gy) * 0.28;
        }
        drawBirdAt(ctx, p._gx, p._gy, p.v || 0, S.bird.r, h, wash, lead ? 1 : 0.25, !!p.laser, false);
      });
    }
    for (const pt of S.particles) {
      ctx.globalAlpha = Math.max(0, pt.life / 0.5);
      ctx.fillStyle = wash || pt.color; ctx.fillRect(pt.x, pt.y, 3, 3);
    }
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const f of S.floats) {
      ctx.font = "700 " + f.size + "px \"IBM Plex Mono\", monospace";
      ctx.globalAlpha = f.maxA * Math.max(0, Math.min(1, f.life / 0.28));
      paintHaloText(ctx, f.text, f.x, f.y, f.color || PAL.fg);
    }
    ctx.globalAlpha = 1;
    if (wash) {
      ctx.fillStyle = palRgba(wash, 0.22);
      ctx.fillRect(0, 0, S.W, S.H);
    }
    ctx.fillStyle = wash || BTC; ctx.fillRect(0, S.H - 3, S.W, 3);
  }

  function paintHeroPreview() {
    const el = $("hero-prev");
    if (!el) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = 168, h = 120;
    if (el.width !== w * dpr || el.height !== h * dpr) {
      el.width = w * dpr;
      el.height = h * dpr;
    }
    const ctx = el.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawWorldBg(ctx, null, w, h);
    ctx.fillStyle = GREEN;
    ctx.fillRect(14, 0, 14, 36);
    ctx.fillRect(14, 78, 14, 42);
    ctx.fillStyle = RED;
    ctx.fillRect(140, 0, 14, 46);
    ctx.fillRect(140, 86, 14, 34);
    const t = performance.now() * 0.001;
    drawBirdAt(ctx, w * 0.5, h * 0.54, Math.sin(t * 4.2) * 90, 15, myHero(), null, 1, false, HERO_ANIM, HERO_SKIN);
    ctx.font = "700 10px \"IBM Plex Mono\", monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    paintHaloText(ctx, HERO_ANIM ? "3D" : "2D", w - 6, h - 5, PAL.hud || PAL.fg);
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
    renderBitcoinCountry();
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

  function renderBitcoinCountry(){
    const bar=$("bc-bar"),panel=$("bc-panel");if(!bar)return;
    const unlocked=!!(S.chanceUsed&&S.chanceUsed.citadelProblem)&&!S.bcArcClosed;
    bar.classList.toggle("hide",!unlocked);
    if(!unlocked){if(panel)panel.classList.add("hide");return;}
    setTxt("bc-mini","NODES "+(S.bcNodes||0)+"/100 · ARMY "+(S.bcArmy||0)+" · WORLD "+(S.bcWorld||20));
    setTxt("bc-nodes",(S.bcNodes||0)+" / 100");setTxt("bc-army",(S.bcArmy||0)+" / 100");setTxt("bc-world",String(S.bcWorld||20));
    setTxt("bc-citadel",S.bcCitadel?"BUILT":"NOT BUILT");setTxt("bc-mine",S.bcMine?"ONLINE":"OFFLINE");
    setTxt("bc-status",S.bcIndependent?"INDEPENDENT":S.bcIsland?"PROJECT":"SEARCHING");
    const ab=$("bc-army10");if(ab){ab.disabled=!S.bcArmyUnlocked||(S.bcArmy||0)>=100||S.bcIndependent;ab.textContent="+10 ARMY · "+(((Math.min(10,100-(S.bcArmy||0)))*.25).toFixed(1))+"%";}
    const dec=$("bc-declare");if(dec){const ready=(S.bcNodes||0)>=100&&!S.bcIndependent;dec.classList.toggle("hide",!ready);}
    setTxt("bc-note",S.bcArmyUnlocked?"Army purchases are permanent. World strength can keep rising.":"Army unlocks after the island security question.");
  }
  function renderHud() {
    const app = $("app");
    if (app) app.classList.toggle("vs-on", !!(S.phase === "mplobby" || S.phase === "mpwin" || S.phase === "mpwait" || S.phase === "count" || (S.mp && S.phase === "play")));
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
    setTxt("h-halves", String(S.halvings || 0) + "/" + String(S.halveSpawned || 0));
    const chip = $("mp-chip");
    if (chip) {
      const show = !!(S.mp && (S.phase === "play" || S.phase === "mpwait" || S.phase === "count"));
      chip.classList.toggle("hide", !show);
      if (show && window.ChoppyMP) {
        const live = window.ChoppyMP.alive() || [];
        const all = window.ChoppyMP.players() || [];
        const mode = (S.mpRules && S.mpRules.mode) || "last";
        const g = S.mpGameN || (window.ChoppyMP.gameN && window.ChoppyMP.gameN()) || 1;
        const bo = (S.mpRules && S.mpRules.bestOf) || 1;
        const tag = mode === "whale" ? t("mpWhale") : mode === "race" ? t("mpRace") : t("mpLast");
        chip.textContent = live.length + "/" + Math.max(all.length, 1) + " · " + tag + (bo > 1 ? " · " + g + "/" + bo : "");
      }
      if (show && S.mp && S.phase === "play" && !S.dead && !S.finished && !S.spectate && window.ChoppyMP && window.ChoppyMP.pulse) {
        if (!S.mpPulseAt || S.lifeT - S.mpPulseAt > 0.12) {
          S.mpPulseAt = S.lifeT;
          window.ChoppyMP.pulse({
            candles: S.candles, lifeT: S.lifeT, alive: true, finished: false,
            x: S.bird.x, y: S.bird.y, v: S.bird.v,
            laser: !!S.laserOn, power: S.power,
            btc: S.btc, cold: S.cold, slot: S.mpSlot
          });
        }
      }
    }
    const listEl = $("mp-hud-list");
    if (listEl) {
      const vs = !!(S.mp && (S.phase === "play" || S.phase === "count" || S.phase === "mpwait"));
      listEl.classList.toggle("hide", !vs);
      if (vs && window.ChoppyMP) {
        const mine = window.ChoppyMP.id();
        const wins = S.mpSeriesWins || (window.ChoppyMP.wins && window.ChoppyMP.wins()) || {};
        const foc = mpFocusPlayer();
        listEl.innerHTML = (window.ChoppyMP.players() || []).map((p) => {
          const h = heroOf(p.slot || 0);
          const dead = p.alive === false;
          const fin = !!p.finished;
          const you = p.id === mine;
          const lead = foc && p.id === foc.id;
          const w = wins[p.id] != null ? wins[p.id] : 0;
          const extra = (lead && S.mpRoundOver) ? t("mpWins") : dead ? t("mpDead") : fin ? t("mpFinished") : "";
          return "<span class=\"mp-pill" + (dead || fin ? " out" : "") + (lead ? " lead" : "") + "\"><span class=\"dot\" style=\"background:" + h.fill + "\"></span>"
            + (p.name || "?") + (you ? " · " + t("mpYou") : "")
            + (S.mpRules && S.mpRules.bestOf > 1 ? " · " + w : "")
            + (extra ? " · " + extra : "") + "</span>";
        }).join("");
      }
    }
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
      buy.classList.toggle("ai-lit", !!(S.aibudOn && S.aibudLit && S.aibudLit.buy));
      buy.classList.remove("on");
      buy.textContent = t("buyBtc");
    }
    if (sell) {
      sell.disabled = locks.trade;
      sell.classList.toggle("ai-lock", locks.trade);
      sell.classList.toggle("ai-lit", !!(S.aibudOn && S.aibudLit && S.aibudLit.sell));
      sell.classList.remove("on");
      sell.textContent = t("sellBtc");
    }
    const playing = S.phase === "play" || S.phase === "paused" || S.phase === "perk" || S.phase === "chance";
    const pauseBtn = $("pause-btn");
    if (pauseBtn) {
      const paused = S.phase === "paused" || S.phase === "perk" || !!S.arcHold;
      pauseBtn.textContent = paused ? "▶" : "||";
      pauseBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
      pauseBtn.classList.toggle("arc-resume", !!(S.arcHold && S.phase === "paused"));
    }
    if (S.have.ff <= 0) S.speedMul = 1;
    $("trades").classList.toggle("hide", !playing);
    $("pause-btn").classList.toggle("hide", !playing || !!S.mp || S.phase === "chance");
    let powers = "";
    const now = S.lifeT;
    const live = liveWaves(now);
    const leftOf = (pred) => {
      let left = 0;
      for (const w of live) if (pred(w)) left = Math.max(left, w.t0 + waveDur() - now);
      return left;
    };
    const hLeft = leftOf((w) => w.kind === "HALVE");
    const bLeft = leftOf((w) => w.type === "BULL" && w.kind !== "HALVE");
    const rLeft = leftOf((w) => w.type === "BEAR");
    const bits = [];
    if (hLeft > 0) bits.push(t("halvingNow") + "  " + Math.ceil(hLeft) + "s");
    if (bLeft > 0) bits.push(t("bullRun") + "  " + Math.ceil(bLeft) + "s");
    if (rLeft > 0) bits.push(t("bearCrash") + "  " + Math.ceil(rLeft) + "s");
    powers = bits.join("  ·  ");
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
  function snapshotRun() {
    S.stats = collectRunStats();
    S.runTape = (S.tape || []).slice();
    S.runMarks = (S.tapeMarks || []).slice();
    S.runTrades = (S.tapeTrades || []).slice();
    S.runCash = (S.tapeCash || []).slice();
    S.runBtcBag = (S.tapeBtcBag || []).slice();
    S.runNet = (S.tapeNet || []).slice();
  }

  function recapL(en, es) {
    return (window.BZ && BZ.lang && BZ.lang() === "es") ? es : en;
  }

  function recapRow(k, v) {
    return "<li><span class=\"k\">" + k + "</span><span>" + v + "</span></li>";
  }

  function runRecapHtml() {
    const st = S.stats || collectRunStats();
    const tab = S.runTab === "chart" ? "chart" : "stats";
    const tabs = "<div class=\"recap-tabs\">"
      + "<button type=\"button\" class=\"cta play-alt" + (tab === "stats" ? " on" : "") + "\" id=\"recap-stats\">" + t("runStats") + "</button>"
      + "<button type=\"button\" class=\"cta play-alt" + (tab === "chart" ? " on" : "") + "\" id=\"recap-chart\">" + t("runChart") + "</button>"
      + "</div>";
    let body;
    if (tab === "chart") {
      body = "<canvas id=\"run-tape\" width=\"420\" height=\"228\"></canvas>"
        + (window.chartOptsHtml ? window.chartOptsHtml(S.chartFlags || { trades: false, btc: false, usd: false, net: false }) : "");
    } else {
      const startNet = (st.startCash || 0) / Math.max(0.01, st.startPrice || 1);
      const pxMul = (st.endPrice || 0) / Math.max(0.01, st.startPrice || 1);
      const netMul = (st.net || 0) / Math.max(1e-9, startNet);
      const awards = runAwards(st);
      body = "<ul class=\"recap-list\">"
        + recapRow(recapL("Time", "Tiempo"), fmtTime(st.time))
        + recapRow(recapL("Candles", "Velas"), String(st.candles || 0))
        + recapRow(recapL("Start cash", "Cash inicial"), money(st.startCash))
        + recapRow(recapL("End cash", "Cash final"), money(st.endCash))
        + recapRow(recapL("BTC stacked", "BTC apilado"), fmtBtc(st.endBtc))
        + recapRow(recapL("Start BTC px", "Precio inicial"), money(st.startPrice))
        + recapRow(recapL("End BTC px", "Precio final"), money(st.endPrice))
        + recapRow(recapL("Price multiple", "Múltiplo de precio"), pxMul.toFixed(2) + "x")
        + recapRow(recapL("Peak net", "Pico patrimonio"), fmtBtc(st.peakNet))
        + recapRow(recapL("Net worth", "Patrimonio"), fmtBtc(st.net))
        + recapRow(recapL("Stack multiple", "Múltiplo de stack"), netMul.toFixed(2) + "x")
        + recapRow(recapL("Buys / sells", "Compras / ventas"), (st.buys || 0) + " / " + (st.sells || 0))
        + recapRow(recapL("Bear sells", "Ventas en bear"), String(st.sellsBear || 0))
        + recapRow(recapL("Halvings", "Halvings"), (st.halvings || 0) + " · miss " + (st.halveMiss || 0))
        + recapRow(recapL("Swans vaporized", "Swans vaporizados"), String(st.swans || 0))
        + recapRow(recapL("Laser eyes", "Ojos láser"), String(st.lasers || 0))
        + recapRow(recapL("Cold lost", "Cold perdidos"), String(st.coldLost || 0))
        + recapRow(recapL("Perks taken", "Perks tomadas"), String(st.haveSum || 0))
        + "</ul>"
        + (awards.length
          ? "<div class=\"awards\"><p class=\"k\">" + recapL("Awards", "Premios") + "</p>"
            + awards.map((a) => "<p><span class=\"ia-act\">" + awardName(a) + "</span> — " + awardWhy(a) + "</p>").join("")
            + "</div>"
          : "");
    }
    return "<h1>" + t("runRecap") + "</h1>" + tabs + body
      + "<button type=\"button\" class=\"cta\" id=\"recap-back\">" + t("back") + "</button>";
  }

  function recapBag() {
    return {
      tape: S.runTape || S.tape || [],
      marks: S.runMarks || [],
      trades: S.runTrades || [],
      tapeCash: S.runCash || S.tapeCash || [],
      tapeBtc: S.runBtcBag || S.tapeBtcBag || [],
      tapeNet: S.runNet || S.tapeNet || []
    };
  }

  function bindRunRecap() {
    const stBtn = $("recap-stats");
    const chBtn = $("recap-chart");
    const back = $("recap-back");
    if (stBtn) stBtn.onclick = (e) => { e.stopPropagation(); S.runTab = "stats"; renderOverlay(); };
    if (chBtn) chBtn.onclick = (e) => { e.stopPropagation(); S.runTab = "chart"; renderOverlay(); };
    if (back) back.onclick = (e) => { e.stopPropagation(); S.runTab = null; renderOverlay(); };
    if (S.runTab === "chart") paintRunTape();
  }

  function paintRunTape() {
    const canvas = $("run-tape");
    if (!canvas) return;
    if (!S.chartFlags) S.chartFlags = { trades: false, btc: false, usd: false, net: false };
    const bag = recapBag();
    if (window.paintRunChart) {
      window.paintRunChart(canvas, bag, S.chartFlags);
      if (window.bindChartControls) window.bindChartControls(overlay, bag, S.chartFlags, canvas);
      return;
    }
    const data = bag.tape || [];
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(0, 0, W, H);
    if (data.length < 2) {
      ctx.fillStyle = "#8a8680";
      ctx.font = "12px \"IBM Plex Mono\", monospace";
      ctx.textAlign = "center";
      ctx.fillText("—", W / 2, H / 2);
      return;
    }
    const target = 92;
    const bucket = Math.max(4, Math.ceil(data.length / target));
    const bars = [];
    for (let i = 0; i < data.length; i += bucket) {
      const sl = data.slice(i, i + bucket);
      const o = bars.length ? bars[bars.length - 1].c : sl[0];
      bars.push({ o: o, h: Math.max.apply(null, sl), l: Math.min.apply(null, sl), c: sl[sl.length - 1], i: i });
    }
    let lo = bars[0].l, hi = bars[0].h;
    for (const b of bars) { if (b.l < lo) lo = b.l; if (b.h > hi) hi = b.h; }
    const pad = Math.max(0.01, (hi - lo) * 0.08);
    lo -= pad; hi += pad;
    const left = 8, right = 8, top = 16, bot = 14;
    const innerW = W - left - right, innerH = H - top - bot;
    const stepX = innerW / Math.max(1, bars.length);
    const cw = Math.max(1.2, Math.min(5.2, stepX * 0.72));
    const py = (v) => top + (1 - (v - lo) / Math.max(0.01, hi - lo)) * innerH;
    bars.forEach((b, i) => {
      const x = left + i * stepX;
      const up = b.c >= b.o;
      ctx.strokeStyle = up ? GREEN : RED;
      ctx.fillStyle = up ? GREEN : RED;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + cw / 2, py(b.h));
      ctx.lineTo(x + cw / 2, py(b.l));
      ctx.stroke();
      ctx.fillRect(x, Math.min(py(b.o), py(b.c)), cw, Math.max(1.1, Math.abs(py(b.c) - py(b.o))));
    });
    const marks = S.runMarks || [];
    ctx.save();
    ctx.font = "700 8px \"IBM Plex Mono\", monospace";
    ctx.textAlign = "center";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(10,10,12,0.82)";
    let lastX = -99;
    for (const mk of marks) {
      const vi = Math.floor((mk.i || 0) / bucket);
      if (vi < 0 || vi >= bars.length) continue;
      const x = left + vi * stepX + cw / 2;
      if (Math.abs(x - lastX) < 28) continue;
      lastX = x;
      const peak = mk.kind === "peak";
      const y = py(mk.price) + (peak ? -4 : 4);
      ctx.textBaseline = peak ? "bottom" : "top";
      const lab = fmtUsd(mk.price);
      paintHaloText(ctx, lab, x, y, peak ? (PAL.labelUp || GREEN) : (PAL.labelDn || RED));
    }
    const trades = S.runTrades || [];
    ctx.font = "700 9px \"IBM Plex Mono\", monospace";
    ctx.textBaseline = "middle";
    for (const tr of trades) {
      const vi = Math.floor((tr.i || 0) / bucket);
      if (vi < 0 || vi >= bars.length) continue;
      const x = left + vi * stepX + cw / 2;
      const y = py(tr.price);
      const buy = tr.kind === "buy";
      ctx.fillStyle = buy ? GREEN : RED;
      ctx.beginPath();
      if (buy) {
        ctx.moveTo(x, y - 8); ctx.lineTo(x + 5.5, y + 3); ctx.lineTo(x - 5.5, y + 3);
      } else {
        ctx.moveTo(x, y + 8); ctx.lineTo(x + 5.5, y - 3); ctx.lineTo(x - 5.5, y - 3);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.textBaseline = buy ? "bottom" : "top";
      paintHaloText(ctx, buy ? "B" : "S", x, buy ? y - 9 : y + 9, buy ? (PAL.labelUp || GREEN) : (PAL.labelDn || RED));
    }
    ctx.restore();
    ctx.font = "700 9px \"IBM Plex Mono\", monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = GREEN;
    ctx.fillText("▲ B buy", 10, H - 12);
    ctx.fillStyle = RED;
    ctx.fillText("▼ S sell", 78, H - 12);
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
    if (panel === "gfx") {
      const pal = currentPaletteId();
      const swatches = Object.keys(PALETTES).map((id) => {
        const p = PALETTES[id];
        return "<button type=\"button\" class=\"cta opt-item pal-swatch" + (pal === id ? " on" : "") + "\" data-pal=\"" + id + "\">"
          + "<span class=\"pal-dots\" aria-hidden=\"true\"><i style=\"background:" + p.bg + "\"></i><i style=\"background:" + p.gold + "\"></i><i style=\"background:" + p.green + "\"></i><i style=\"background:" + p.red + "\"></i></span>"
          + t(p.nameKey) + "</button>";
      }).join("");
      return "<h1>" + t("graphics") + "</h1>"
        + "<button type=\"button\" class=\"hero-tog\" id=\"hero-tog\" aria-label=\"" + t("tapHero") + "\">"
        + "<canvas id=\"hero-prev\" class=\"hero-prev\" width=\"168\" height=\"120\"></canvas>"
        + "</button>"
        + "<p class=\"hero-prev-cap\">" + t("tapHero") + "</p>"
        + "<div class=\"pal-grid\">" + swatches + "</div>"
        + "<button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
    }
    const fromPlay = S.optBack === "play" || S.phase === "paused";
    return "<h1>" + (fromPlay ? t("paused") : t("options")) + "</h1>"
      + "<div class=\"opt-menu\">"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-lang\">" + t("language") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-sound\">" + t("sound") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-gfx\">" + t("graphics") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-arc\">" + t("arcCards") + " · " + (ARC_TLDR ? t("arcTldrOn") : t("arcFullOn")) + "</button>"
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
    if (helpBack) helpBack.onclick = (e) => { e.stopPropagation(); S.optPanel = "menu"; renderOverlay(); };
    overlay.querySelectorAll("[data-buy]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const kind = btn.getAttribute("data-buy");
        const mul = S.ranked ? 10 : 1;
        const cost = (kind === "cold" ? 1200 : kind === "laser" ? 1800 : 9000) * mul;
        if (S.cash < cost) { say("Not enough cash", false); renderOverlay(); return; }
        S.cash -= cost;
        if (kind === "cold") { S.cold += 1; packCold(); }
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
    const optGfx = $("opt-gfx");
    if (optGfx) optGfx.onclick = (e) => { e.stopPropagation(); S.optPanel = "gfx"; renderOverlay(); };
    const optArc = $("opt-arc");
    if (optArc) optArc.onclick = (e) => {
      e.stopPropagation();
      setArcTldr(!ARC_TLDR);
      renderOverlay();
    };
    overlay.querySelectorAll("[data-pal]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        applyPalette(btn.getAttribute("data-pal"));
        setHero(btn.getAttribute("data-pal"), false);
        renderOverlay();
      };
    });
    const heroTog = $("hero-tog") || $("hero-prev");
    if (heroTog) {
      heroTog.onpointerdown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const skin = HERO_SKIN || currentPaletteId();
        setHero(skin, !HERO_ANIM);
      };
    }
  }

  function mpRosterHtml() {
    const list = (window.ChoppyMP && window.ChoppyMP.players()) || [];
    if (!list.length) return "<p class=\"k\">—</p>";
    return "<ul class=\"mp-list\">" + list.map((p) => {
      const you = window.ChoppyMP && p.id === window.ChoppyMP.id();
      const dead = p.alive === false;
      const h = heroOf(p.slot || 0);
      const ready = p.ready ? " · " + t("mpReady") : "";
      const glyphs = { btc: "₿", usdt: "₮", eth: "Ξ", bch: "₿", xrp: "X", bnb: "B", sol: "S", trx: "T" };
      const glyph = glyphs[h.mark] || "₿";
      return "<li class=\"" + (dead ? "out" : "") + "\"><span class=\"hero-dot\" style=\"background:" + h.fill + ";color:" + h.ink + "\">" + glyph + "</span>"
        + (p.name || "?") + (you ? " · " + t("mpYou") : "") + (p.host ? " · host" : "")
        + (dead ? " · " + t("mpDead") : ready) + eloBit(p) + "</li>";
    }).join("") + "</ul>";
  }
  function eloBit(p) {
    const bag = S.mpElo;
    if (Array.isArray(bag) && p.uid) {
      const row = bag.find((r) => r.id === p.uid);
      if (row && row.elo != null) return " · " + Math.round(row.elo);
    }
    return p.uid ? "" : " · guest";
  }
  function mpRulesNow() {
    return S.mpRules || (window.ChoppyMP && window.ChoppyMP.rules && window.ChoppyMP.rules()) || {
      startCold: 0, msig: 0, bull: 38, bear: 22, laser: 10, swan: 20, cold: 10,
      mode: "last", raceN: 21, bestOf: 1,
      muteTheme: false, muteSfx: false, muteVoice: false
    };
  }
  function mpMixTotal(r) {
    r = r || mpRulesNow();
    return (r.bull | 0) + (r.bear | 0) + (r.laser | 0) + (r.swan | 0) + (r.cold | 0);
  }
  function mpFocusPlayer() {
    const list = (window.ChoppyMP && window.ChoppyMP.players && window.ChoppyMP.players()) || [];
    if (!list.length) return null;
    if (S.mpWinner && S.mpWinner.id) {
      const w = list.find((p) => p.id === S.mpWinner.id);
      if (w) return w;
    }
    const mode = (S.mpRules && S.mpRules.mode) || "last";
    if (mode === "whale") {
      return list.slice().sort((a, b) => (Number(b.btc) || 0) - (Number(a.btc) || 0))[0];
    }
    if (mode === "race") {
      const fin = list.filter((p) => p.finished).sort((a, b) => (Number(a.finishT) || 0) - (Number(b.finishT) || 0))[0];
      if (fin) return fin;
      return list.filter((p) => p.alive !== false).sort((a, b) => (Number(b.candles) || 0) - (Number(a.candles) || 0))[0] || list[0];
    }
    const live = list.filter((p) => p.alive !== false && !p.finished);
    return live.slice().sort((a, b) => (Number(b.lifeT) || 0) - (Number(a.lifeT) || 0) || (Number(b.candles) || 0) - (Number(a.candles) || 0))[0] || list[0];
  }
  function mpFinishRace() {
    if (!S.mp || S.finished || S.dead) return;
    S.finished = true;
    try { snapshotRun(); } catch (e) {}
    try {
      if (window.ChoppyMP && window.ChoppyMP.finish) {
        window.ChoppyMP.finish({
          candles: S.candles, lifeT: S.lifeT, btc: S.btc, finishT: S.lifeT,
          x: S.bird.x, y: S.bird.y, v: S.bird.v
        });
      }
    } catch (e) {}
    const foc = mpFocusPlayer();
    const me = window.ChoppyMP && window.ChoppyMP.id();
    if (foc && foc.id !== me) S.spectate = true;
    renderHud();
    renderOverlay();
  }
  function mpRulesHtml() {
    const r = mpRulesNow();
    const host = !!(window.ChoppyMP && window.ChoppyMP.get && window.ChoppyMP.get().host);
    const dis = host ? "" : " disabled";
    const sum = mpMixTotal(r);
    const open = S.mpRulesOpen === false ? "" : " open";
    const mode = r.mode || "last";
    const raceHide = mode === "race" ? "" : " hide";
    const radio = (val, lab) =>
      "<label class=\"mp-mode" + (mode === val ? " on" : "") + "\"><input type=\"radio\" name=\"mp-mode\" value=\"" + val + "\""
      + (mode === val ? " checked" : "") + dis + "> " + lab + "</label>";
    return "<details class=\"mp-rules\"" + open + "><summary>" + t("mpRules") + (host ? "" : " · view") + "</summary>"
      + "<div class=\"mp-modes\">"
      + radio("last", t("mpLast"))
      + radio("whale", t("mpWhale"))
      + radio("race", t("mpRace"))
      + "</div>"
      + "<div class=\"mp-rule" + raceHide + "\" id=\"mp-race-row\"><span>" + t("mpRaceN") + "</span><input type=\"number\" id=\"mp-race-n\" min=\"5\" max=\"210\" value=\"" + (r.raceN | 0 || 21) + "\"" + dis + "></div>"
      + "<div class=\"mp-rule\"><span>" + t("mpBestOf") + "</span><select id=\"mp-bestof\"" + dis + ">"
      + [1, 3, 5, 7].map((n) => "<option value=\"" + n + "\"" + ((r.bestOf | 0) === n ? " selected" : "") + ">" + n + "</option>").join("")
      + "</select></div>"
      + "<div class=\"mp-rule\"><span>" + t("mpCold0") + "</span><input type=\"number\" id=\"mp-cold\" min=\"0\" max=\"99\" value=\"" + (r.startCold | 0) + "\"" + dis + "></div>"
      + "<p class=\"k mp-mix-sum" + (sum !== 100 ? " bad" : "") + "\" id=\"mp-mix-sum\">" + t("mpMix") + " · " + Math.round(sum) + (sum !== 100 ? " · " + t("mpMixNeed") : "") + "</p>"
      + "<div class=\"mp-w\">"
      + "<label>" + t("mpBull") + "</label><input type=\"number\" id=\"mp-w-bull\" min=\"0\" max=\"100\" value=\"" + (r.bull | 0) + "\"" + dis + ">"
      + "<label>" + t("mpBear") + "</label><input type=\"number\" id=\"mp-w-bear\" min=\"0\" max=\"100\" value=\"" + (r.bear | 0) + "\"" + dis + ">"
      + "<label>" + t("mpLaserW") + "</label><input type=\"number\" id=\"mp-w-laser\" min=\"0\" max=\"100\" value=\"" + (r.laser | 0) + "\"" + dis + ">"
      + "<label>" + t("mpSwanW") + "</label><input type=\"number\" id=\"mp-w-swan\" min=\"0\" max=\"100\" value=\"" + (r.swan | 0) + "\"" + dis + ">"
      + "<label>" + t("mpColdW") + "</label><input type=\"number\" id=\"mp-w-cold\" min=\"0\" max=\"100\" value=\"" + (r.cold | 0) + "\"" + dis + ">"
      + "</div>"
      + "<div class=\"mute-row\" style=\"margin-top:8px\">"
      + "<button type=\"button\" class=\"mute-tog" + (r.muteTheme ? " on" : "") + "\" id=\"mp-mute-theme\"" + (host ? "" : " disabled") + ">" + t("bullSongs") + " " + (r.muteTheme ? t("soundOff") : t("soundOn")) + "</button>"
      + "<button type=\"button\" class=\"mute-tog" + (r.muteSfx ? " on" : "") + "\" id=\"mp-mute-sfx\"" + (host ? "" : " disabled") + ">" + t("gameFx") + " " + (r.muteSfx ? t("soundOff") : t("soundOn")) + "</button>"
      + "<button type=\"button\" class=\"mute-tog" + (r.muteVoice ? " on" : "") + "\" id=\"mp-mute-voice\"" + (host ? "" : " disabled") + ">" + t("voices") + " " + (r.muteVoice ? t("soundOff") : t("soundOn")) + "</button>"
      + "</div></details>";
  }
  function readMpRulesForm() {
    const num = (id, d) => {
      const el = $(id);
      const v = el ? Number(el.value) : d;
      return isFinite(v) ? v : d;
    };
    const r = mpRulesNow();
    let mode = r.mode || "last";
    const picked = overlay && overlay.querySelector && overlay.querySelector("input[name=\"mp-mode\"]:checked");
    if (picked) mode = picked.value;
    const boEl = $("mp-bestof");
    const bestOf = boEl ? (Number(boEl.value) || 1) : (r.bestOf || 1);
    return {
      startCold: Math.max(0, Math.min(99, num("mp-cold", r.startCold) | 0)),
      msig: 0,
      bull: Math.max(0, Math.min(100, num("mp-w-bull", r.bull) | 0)),
      bear: Math.max(0, Math.min(100, num("mp-w-bear", r.bear) | 0)),
      laser: Math.max(0, Math.min(100, num("mp-w-laser", r.laser) | 0)),
      swan: Math.max(0, Math.min(100, num("mp-w-swan", r.swan) | 0)),
      cold: Math.max(0, Math.min(100, num("mp-w-cold", r.cold) | 0)),
      mode: mode === "whale" || mode === "race" ? mode : "last",
      raceN: Math.max(5, Math.min(210, num("mp-race-n", r.raceN) | 0)),
      bestOf: bestOf === 3 || bestOf === 5 || bestOf === 7 ? bestOf : 1,
      muteTheme: !!(r.muteTheme),
      muteSfx: !!(r.muteSfx),
      muteVoice: !!(r.muteVoice)
    };
  }
  function pushHostRules(extra) {
    if (!window.ChoppyMP || !window.ChoppyMP.get().host) return;
    const r = Object.assign(readMpRulesForm(), extra || {});
    S.mpRules = r;
    window.ChoppyMP.setRules(r);
  }
  function mpLobbyHtml() {
    const mp = window.ChoppyMP && window.ChoppyMP.get();
    const code = (mp && mp.code) || "----";
    const n = ((mp && mp.players) || []).length;
    const host = !!(mp && mp.host);
    const ready = !!(mp && mp.ready);
    const all = !!(window.ChoppyMP && window.ChoppyMP.allReady && window.ChoppyMP.allReady());
    const mix = mpRulesNow();
    const mixSum = mpMixTotal(mix);
    const canStart = host && n >= 2 && all && mixSum === 100;
    const err = S.mpErr ? "<p class=\"k\">" + S.mpErr + "</p>" : "";
    if (!mp || !mp.code) {
      return "<h1>" + t("versus") + "</h1><p class=\"k\">" + t("mpNote") + "</p>"
        + "<button class=\"cta mp-cta\" id=\"mp-host\">" + t("mpHost") + "</button>"
        + "<div class=\"mp-join\"><input id=\"mp-code\" maxlength=\"6\" placeholder=\"CODE\" value=\"" + (S.mpJoinCode || "") + "\" autocomplete=\"off\">"
        + "<button class=\"cta play-alt\" id=\"mp-join\">" + t("mpJoin") + "</button></div>"
        + err
        + "<button class=\"cta play-alt mp-cta\" id=\"mp-back\">" + t("mpBack") + "</button>";
    }
    return "<h1>" + t("versus") + "</h1><p class=\"k\">" + t("mpCode") + " <b id=\"mp-code-lab\">" + code + "</b></p>"
      + "<button class=\"cta play-alt mp-cta\" id=\"mp-copy\">" + t("mpCopy") + "</button>"
      + "<p class=\"k\">" + n + "/8 · " + (mix.mode === "whale" ? t("mpWhale") : mix.mode === "race" ? t("mpRace") : t("mpLast"))
      + (mix.bestOf > 1 ? " · " + t("mpBestOf") + " " + mix.bestOf : "") + "</p>"
      + mpRosterHtml()
      + (n < 2 ? "<p class=\"k\">" + t("mpNeed") + "</p>" : (all ? (mixSum === 100 ? "" : "<p class=\"k\">" + t("mpMixNeed") + "</p>") : "<p class=\"k\">" + t("mpNeedReady") + "</p>"))
      + err
      + (host
        ? "<button class=\"cta mp-cta\" id=\"mp-start\"" + (canStart ? "" : " disabled") + ">" + t("mpStart") + "</button>"
        : "<button class=\"cta mp-cta\" id=\"mp-ready\">" + (ready ? t("mpUnready") : t("mpReady")) + "</button>")
      + mpRulesHtml()
      + "<button class=\"cta play-alt mp-cta\" id=\"mp-back\">" + t("mpBack") + "</button>";
  }
  function bindMpLobby() {
    if ($("mp-host")) $("mp-host").onclick = (e) => { e.stopPropagation(); S.mpErr = ""; if (window.ChoppyMP) window.ChoppyMP.host(); };
    if ($("mp-join")) $("mp-join").onclick = (e) => {
      e.stopPropagation();
      const inp = $("mp-code");
      S.mpJoinCode = inp ? String(inp.value||"").trim().toUpperCase() : "";
      if(S.mpJoinCode.length<4){S.mpErr="Enter a room code";renderOverlay();return;}
      S.mpErr = "";
      if (window.ChoppyMP) window.ChoppyMP.join(S.mpJoinCode);
    };
    if ($("mp-ready")) $("mp-ready").onclick = (e) => {
      e.stopPropagation();
      const mp = window.ChoppyMP && window.ChoppyMP.get();
      if (window.ChoppyMP && window.ChoppyMP.setReady) window.ChoppyMP.setReady(!(mp && mp.ready));
    };
    if ($("mp-start")) $("mp-start").onclick = (e) => {
      e.stopPropagation();
      const r = readMpRulesForm();
      const sum = mpMixTotal(r);
      if (sum !== 100) { S.mpErr = t("mpMixNeed"); renderOverlay(); return; }
      pushHostRules();
      if (window.ChoppyMP) {
        if (window.ChoppyMP.setReady) window.ChoppyMP.setReady(true);
        window.ChoppyMP.start({ rules: r });
      }
    };
    const rulesEl = overlay && overlay.querySelector && overlay.querySelector("details.mp-rules");
    if (rulesEl) rulesEl.ontoggle = () => { S.mpRulesOpen = !!rulesEl.open; };
    const paintMix = () => {
      const r = readMpRulesForm();
      const sum = mpMixTotal(r);
      const el = $("mp-mix-sum");
      if (el) {
        el.textContent = t("mpMix") + " · " + sum + (sum !== 100 ? " · " + t("mpMixNeed") : "");
        el.classList.toggle("bad", sum !== 100);
      }
      const start = $("mp-start");
      if (start) {
        const all = window.ChoppyMP && window.ChoppyMP.allReady && window.ChoppyMP.allReady();
        const n = ((window.ChoppyMP && window.ChoppyMP.players && window.ChoppyMP.players()) || []).length;
        start.disabled = !all || sum !== 100 || n < 2;
      }
      const row = $("mp-race-row");
      if (row) row.classList.toggle("hide", r.mode !== "race");
      overlay.querySelectorAll(".mp-mode").forEach((lab) => {
        const inp = lab.querySelector("input");
        lab.classList.toggle("on", !!(inp && inp.checked));
      });
    };
    if ($("mp-copy")) $("mp-copy").onclick = (e) => {
      e.stopPropagation();
      const c = window.ChoppyMP && window.ChoppyMP.code();
      const btn = $("mp-copy");
      const done = () => {
        if (!btn) return;
        btn.textContent = t("mpCopied");
        setTimeout(() => { if ($("mp-copy")) $("mp-copy").textContent = t("mpCopy"); }, 1400);
      };
      if (c && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(c).then(done).catch(() => { try { done(); } catch (err) {} });
      }
    };
    if ($("mp-back")) $("mp-back").onclick = (e) => { e.stopPropagation(); leaveMp(); };
    const inp = $("mp-code");
    if (inp) {
      inp.oninput = () => {
        inp.value = String(inp.value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
        S.mpJoinCode = inp.value;
      };
      inp.onkeydown = (e) => { if (e.key === "Enter" && $("mp-join")) $("mp-join").click(); };
    }
    ["mp-cold", "mp-w-bull", "mp-w-bear", "mp-w-laser", "mp-w-swan", "mp-w-cold", "mp-race-n", "mp-bestof"].forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.oninput = () => { pushHostRules(); paintMix(); };
      el.onchange = () => { pushHostRules(); paintMix(); };
    });
    overlay.querySelectorAll("input[name=\"mp-mode\"]").forEach((inp) => {
      inp.onchange = () => { pushHostRules(); paintMix(); };
    });
    const bindMute = (id, key) => {
      const el = $(id);
      if (!el) return;
      el.onclick = (e) => {
        e.stopPropagation();
        const r = mpRulesNow();
        r[key] = !r[key];
        pushHostRules(r);
        if (window.ChoppyMP && window.ChoppyMP.get().host) applyMpSound(r);
      };
    };
    bindMute("mp-mute-theme", "muteTheme");
    bindMute("mp-mute-sfx", "muteSfx");
    bindMute("mp-mute-voice", "muteVoice");
  }
  function applyMpSound(r) {
    if (!A) return;
    try { if (A.setMuteTheme) A.setMuteTheme(!!r.muteTheme); } catch (e) {}
    try { if (A.setMuteSfx) A.setMuteSfx(!!r.muteSfx); } catch (e) {}
    try { if (A.setMuteVoice) A.setMuteVoice(!!r.muteVoice); } catch (e) {}
  }
  function mpWaitHtml() {
    return mpSpecHtml();
  }
  function mpSpecHtml() {
    const foc = mpFocusPlayer() || S.mpWinner || {};
    const mine = window.ChoppyMP && window.ChoppyMP.id();
    const win = S.mpWinner || {};
    const last = !!S.mpSeriesOver;
    const left = S.mpNextAt ? Math.max(0, Math.ceil((S.mpNextAt - Date.now()) / 1000)) : 0;
    const title = S.mpRoundOver
      ? (win.id === mine ? t("mpYouWin") : ((win.name || foc.name || "?") + " " + t("mpWins")))
      : (t("mpSpec") + " · " + (foc.name || ""));
    const bo = (S.mpRules && S.mpRules.bestOf) || 1;
    const series = bo > 1
      ? "<p class=\"k\">" + t("mpSeries") + " " + (S.mpGameN || 1) + "/" + bo + (S.mpEloNote ? " · " + S.mpEloNote : "") + "</p>"
      : (S.mpEloNote ? "<p class=\"k\">" + S.mpEloNote + "</p>" : "");
    const pool = last ? ((window.ChoppyMP && window.ChoppyMP.players && window.ChoppyMP.players()) || []).filter((p) => !p.gone) : [];
    const votes = pool.filter((p) => p.rematch).length;
    const voteN = pool.length;
    const timer = S.mpRoundOver && left
      ? "<p class=\"k\">" + (last ? t("mpRematch") + (voteN ? " " + votes + "/" + voteN : "") : t("mpNext")) + " · " + left + "s</p>"
      : "";
    return "<p class=\"k\">" + title + "</p>" + series + timer
      + "<div class=\"overlay-actions\">"
      + "<button type=\"button\" class=\"cta play-alt\" id=\"mp-quit\">" + t("mpQuit") + "</button>"
      + "<button type=\"button\" class=\"cta play-alt\" id=\"mp-stats\">" + t("runStats") + "</button>"
      + (last ? "<button type=\"button\" class=\"cta" + (S.mpRematchOn ? " on" : "") + "\" id=\"mp-rematch\">" + t("mpRematch") + "</button>" : "")
      + "</div>";
  }
  function bindMpSpec() {
    if ($("mp-quit")) $("mp-quit").onclick = (e) => { e.stopPropagation(); leaveMp(); };
    if ($("mp-stats")) $("mp-stats").onclick = (e) => {
      e.stopPropagation();
      if (!S.stats) try { snapshotRun(); } catch (err) {}
      S.runTab = "stats";
      renderOverlay();
    };
    if ($("mp-rematch")) $("mp-rematch").onclick = (e) => {
      e.stopPropagation();
      S.mpRematchOn = !S.mpRematchOn;
      if (window.ChoppyMP && window.ChoppyMP.setRematch) window.ChoppyMP.setRematch(S.mpRematchOn);
      renderOverlay();
    };
  }
  function mpWinHtml() {
    const w = S.mpWinner || {};
    const mine = window.ChoppyMP && w.id === window.ChoppyMP.id();
    const host = window.ChoppyMP && window.ChoppyMP.get().host;
    return "<p class=\"k\">" + t("versus") + "</p><h1>" + (mine ? t("mpYouWin") : (w.name || "?") + " " + t("mpWins")) + "</h1>"
      + (S.mpEloNote ? "<p class=\"k\">" + S.mpEloNote + "</p>" : "")
      + mpRosterHtml()
      + "<div class=\"overlay-actions\">"
      + (host ? "<button class=\"cta\" id=\"mp-again\">" + t("mpReady") + "</button>" : "")
      + "<button class=\"cta play-alt\" id=\"go\">" + t("mpBack") + "</button></div>";
  }
  function openMpLobby() {
    S.mpErr = "";
    S.mp = false; S.mpRulesOpen=true; S.mpJoinCode="";
    setPhase("mplobby");
  }
  function playAtFromGo(data) {
    const now = Date.now();
    if (data && data.sentAt && data.startAt) {
      const delay = data.startAt - data.sentAt;
      return now + Math.max(900, Math.min(5000, delay));
    }
    if (data && data.startAt) {
      const remain = data.startAt - now;
      if (remain > 500 && remain < 8000) return data.startAt;
    }
    return now + 3200;
  }
  function beginMpCountdown(data) {
    S.mp = true;
    S.mpOver = false;
    S.mpRoundOver = false;
    S.mpSeriesOver = false;
    S.mpWinner = null;
    S.spectate = false;
    S.finished = false;
    S.mpRematchOn = false;
    S.mpNextAt = 0;
    S.runTab = null;
    S.worldSeed = (data && data.seed) >>> 0 || 1;
    S.mpRules = (data && data.rules) || mpRulesNow();
    S.mpPlayAt = playAtFromGo(data);
    S.mpSlot = (window.ChoppyMP && window.ChoppyMP.slot && window.ChoppyMP.slot()) || 0;
    S.mpSeriesWins = (data && data.wins) || (window.ChoppyMP && window.ChoppyMP.wins && window.ChoppyMP.wins()) || {};
    S.mpGameN = (data && data.gameN) || (window.ChoppyMP && window.ChoppyMP.gameN && window.ChoppyMP.gameN()) || 1;
    S.ranked = false;
    applyMpSound(S.mpRules);
    resetWorld(false);
    S.dead = false;
    S.countN = 3;
    setPhase("count");
  }
  function startMpPlay() {
    if (!S.mp || S.phase === "play") return;
    S.dead = false;
    S.phase = "play";
    if (field) field.classList.add("is-play");
    if (overlay) hideOverlay();
    if (A && A.startMusic) kickTheme();
    renderHud();
  }
  function startMpMatch(seed) {
    beginMpCountdown({ seed: seed, startAt: Date.now() + 3200, rules: mpRulesNow() });
  }
  function reportMpElo() {
    S.mpElo = null;
    S.mpEloNote = "";
    const list = (window.ChoppyMP && window.ChoppyMP.players()) || [];
    const uids = [];
    list.forEach((p) => { if (p.uid && uids.indexOf(p.uid) < 0) uids.push(p.uid); });
    const w = S.mpWinner || {};
    if (!w.uid || uids.length < 2) {
      S.mpEloNote = t("eloGuest");
      return;
    }
    if (typeof window.submitVersusResult !== "function") {
      S.mpEloNote = t("eloGuest");
      return;
    }
    Promise.resolve(window.submitVersusResult(S.worldSeed, w.uid, uids)).then((rows) => {
      if (Array.isArray(rows) && rows.length) {
        S.mpElo = rows;
        S.mpEloNote = t("eloUpdated");
      } else S.mpEloNote = t("eloPending");
      if (S.phase === "mpwin" || S.mpRoundOver) renderOverlay();
    }).catch(() => {
      S.mpEloNote = t("eloPending");
      if (S.phase === "mpwin" || S.mpRoundOver) renderOverlay();
    });
  }
  function leaveMp() {
    try { if (window.ChoppyMP) window.ChoppyMP.leave(); } catch (e) {}
    S.mp = false; S.mpOver = false; S.mpRoundOver = false; S.worldSeed = 0; S.worldRand = null; S.mpWinner = null; S.mpElo = null; S.mpEloNote = "";
    S.mpRules = null; S.mpPlayAt = 0; S.dead = false; S.spectate = false; S.finished = false; S.mpNextAt = 0; S.mpRematchOn = false; S.runTab = null;
    const app = $("app");
    if (app) app.classList.remove("vs-on");
    setPhase("ready");
  }
  function wireMp() {
    if (!window.ChoppyMP) return;
    window.ChoppyMP.setHandler((ev, data) => {
      const typing = () => {
        const ae = document.activeElement;
        return !!(ae && overlay && overlay.contains(ae) && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA"));
      };
      if (ev === "lobby" || ev === "roster") {
        if (S.phase === "mplobby" || S.phase === "mpwait") {
          if (!typing()) renderOverlay();
        }
        else if (S.phase === "play" || S.phase === "count") {
          renderHud();
          if (S.phase === "play" && (S.spectate || S.mpRoundOver) && !S.runTab) renderOverlay();
        }
      } else if (ev === "rules") {
        S.mpRules = data || S.mpRules;
        if ((S.phase === "mplobby" || S.phase === "mpwait") && !typing()) renderOverlay();
      } else if (ev === "reset") {
        S.mpOver = false;
        S.mpRoundOver = false;
        S.mp = !!(window.ChoppyMP && window.ChoppyMP.get && window.ChoppyMP.get().code);
        S.dead = false;
        S.spectate = false;
        S.finished = false;
        S.mpPlayAt = 0;
        S.mpNextAt = 0;
        setPhase("mplobby");
      } else if (ev === "dropped") {
        leaveMp();
      } else if (ev === "go") {
        const ids = ((data && data.players) || []).map((p) => p.id);
        if (ids.length && window.ChoppyMP && ids.indexOf(window.ChoppyMP.id()) < 0) {
          leaveMp();
          return;
        }
        if (S.phase === "count" && S.worldSeed && data && ((data.seed >>> 0) === S.worldSeed)) return;
        beginMpCountdown(data || {});
      } else if (ev === "lead") {
        S.mpWinner = data && data.winner;
        if (S.phase === "play") {
          renderHud();
          if (S.spectate || S.mpRoundOver) renderOverlay();
        }
      } else if (ev === "over") {
        if (S.mpRoundOver) return;
        S.mpRoundOver = true;
        S.mpOver = true;
        S.mpWinner = data && data.winner;
        S.mpSeriesWins = (data && data.wins) || S.mpSeriesWins || {};
        S.mpGameN = (data && data.gameN) || S.mpGameN || 1;
        S.mpSeriesOver = !!(data && data.seriesOver);
        S.mpNextAt = Date.now() + Math.max(4000, (data && data.waitMs) || (S.mpSeriesOver ? 12000 : 8000));
        const me = window.ChoppyMP && window.ChoppyMP.id();
        if (S.mpWinner && me && S.mpWinner.id !== me) S.spectate = true;
        if (S.mpSeriesOver) reportMpElo();
        renderHud();
        renderOverlay();
      } else if (ev === "err") {
        S.mpErr = data === "need 2" ? t("mpNeed") : data === "not ready" ? t("mpNeedReady") : data === "full" ? t("mpFull") : data === "mix" ? t("mpMixNeed") : String(data || "error");
        if (S.phase === "mplobby" || S.phase === "mpwait") renderOverlay();
      }
    });
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
    if (p === "play") {
      if (S.mp && (S.spectate || S.mpRoundOver || S.finished)) {
        showOverlay();
        overlay.classList.add("dock", "mp-spec");
        overlay.classList.remove("mp-ui", "chance-ui", "juke-ui");
        if (S.runTab) {
          overlay.innerHTML = runRecapHtml();
          bindRunRecap();
        } else {
          overlay.innerHTML = mpSpecHtml();
          bindMpSpec();
        }
        return;
      }
      hideOverlay();
      overlay.classList.remove("mp-spec", "dock");
      return;
    }
    overlay.classList.remove("mp-spec");
    showOverlay();
    overlay.classList.toggle("dock", p === "perk" || p === "paused" || p === "chance");
    overlay.classList.toggle("mp-ui", p === "mplobby" || p === "mpwait" || p === "mpwin");
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
          + "<button type=\"button\" class=\"cta play-alt\" id=\"go-mp\">" + t("versus") + "</button>"
          + "<p class=\"k\">" + t("mpNote") + "</p>"
          + (window.choppySignedIn ? "" : "<button type=\"button\" class=\"cta play-alt\" id=\"overlay-auth\">" + t("signIn") + "</button>")
          + tutorialBody()
          + awardListHtml(loadAwards(), "full")
          + "<h3 class=\"k\">" + t("board") + "</h3><pre id=\"ready-board\" class=\"board\">—</pre>"
          + "<h3 class=\"k\">" + t("eloBoard") + "</h3><pre id=\"ready-elo\" class=\"board\">—</pre>";
        $("go").onclick = () => startGame(true);
        $("go").onpointerdown = (e) => { e.stopPropagation(); startGame(true); };
        if ($("go-train")) {
          $("go-train").onclick = () => startGame(false);
          $("go-train").onpointerdown = (e) => { e.stopPropagation(); startGame(false); };
        }
        if ($("go-mp")) {
          $("go-mp").onclick = (e) => { e.stopPropagation(); openMpLobby(); };
          $("go-mp").onpointerdown = (e) => { e.stopPropagation(); openMpLobby(); };
        }
        const oa = $("overlay-auth");
        if (oa) oa.onclick = (e) => { e.stopPropagation(); if (window.openAuth) window.openAuth(); };
        if (window.refreshLeaderboard) window.refreshLeaderboard("ready-board");
      }
    } else if (p === "mplobby") {
      overlay.innerHTML = mpLobbyHtml();
      bindMpLobby();
    } else if (p === "mpwait") {
      overlay.innerHTML = mpSpecHtml();
      bindMpSpec();
    } else if (p === "mpwin") {
      overlay.innerHTML = mpWinHtml();
      if ($("go")) $("go").onclick = (e) => { e.stopPropagation(); leaveMp(); };
      if ($("mp-again") && window.ChoppyMP && window.ChoppyMP.get().host) {
        $("mp-again").onclick = (e) => {
          e.stopPropagation();
          S.mpOver = false;
          if (window.ChoppyMP.resetLobby) window.ChoppyMP.resetLobby();
          setPhase("mplobby");
        };
      }
    } else if (p === "count") {
      overlay.innerHTML = "<p class=\"count\">" + S.countN + "</p>";
    } else if (p === "chance") {
      if (S.optPanel) {
        overlay.classList.add("chance-options");
        overlay.innerHTML = "<div class=\"chance-options-sheet\">" + pauseMarkup() + "</div>";
        bindPauseUi();
        return;
      }
      overlay.classList.remove("chance-options");
      const card = S.chanceCard;
      if (!card) { finishArcHold(); return; }
      const es = chanceLang();
      const title = es ? (card.titleEs || card.title) : card.title;
      const body = S.chanceBody || (es ? (card.bodyEs || card.body) : card.body);
      const pic = chanceArtHtml(card.id);
      if(card.kind==="chess"&&!S.chanceNote){
        const files=["a","b","c","d","e","f","g","h"], ranks=["1","2","3","4","5","6","7","8"];
        overlay.innerHTML="<h1>"+t("chanceHead")+"</h1>"+pic+"<p class=\"k\">"+title+"</p>"+arcStoryHtml(card,body)
          +"<div class=\"chess-answer\"><select id=\"ch-piece\"><option>King</option><option selected>Queen</option><option>Rook</option><option>Bishop</option><option>Knight</option><option>Pawn</option></select>"
          +"<select id=\"ch-file\">"+files.map(v=>"<option>"+v+"</option>").join("")+"</select>"
          +"<select id=\"ch-rank\">"+ranks.map(v=>"<option>"+v+"</option>").join("")+"</select>"
          +"<button class=\"cta\" id=\"ch-submit\">PLAY MOVE</button><button class=\"cta play-alt\" id=\"ch-noidea\">NO IDEA</button></div>";
        $("ch-submit").onclick=(e)=>{e.stopPropagation();const piece=$("ch-piece").value[0],sq=$("ch-file").value+$("ch-rank").value;pickChance(piece+sq);};
        $("ch-noidea").onclick=(e)=>{e.stopPropagation();pickChance("noidea");};
        return;
      }
      let btns = "";
      if (S.chanceNote) {
        btns = "<button class=\"cta\" data-ch=\"ok\">" + t("chanceAck") + "</button>";
        overlay.innerHTML = "<h1>" + t("chanceHead") + "</h1>" + pic + "<p class=\"k\">" + title + "</p>"
          + arcOutcomeHtml()
          + "<div class=\"arc-actions\">" + btns + "</div>";
      } else {
        btns = (card.opts || []).map((o) => {
          const lab = arcOptionLabel(card,o,es);
          return "<button class=\"cta\" data-ch=\"" + o.k + "\">" + lab + "</button>";
        }).join("");
        const ack = !btns;
        if (ack) btns = "<button class=\"cta\" data-ch=\"ok\">" + t("chanceAck") + "</button>";
        overlay.innerHTML = "<h1>" + t("chanceHead") + "</h1>" + pic + "<p class=\"k\">" + title + "</p>"
          + arcStoryHtml(card, body)
          + "<div class=\"arc-actions\">" + btns + "</div>";
      }
      overlay.querySelectorAll("[data-ch]").forEach((btn) => {
        const go = (e) => { e.preventDefault(); e.stopPropagation(); pickChance(btn.getAttribute("data-ch")); };
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
      if (S.optPanel === "off" || (S.arcHold && !S.optPanel)) {
        hideOverlay();
        overlay.classList.remove("chance-ui", "dock", "juke-ui", "mp-ui");
        return;
      }
      overlay.innerHTML = pauseMarkup();
      bindPauseUi();
    } else if (p === "over") {
      try {
        if (!S.stats) snapshotRun();
        const ids = runAwardIds(S.stats);
        mergeAwards(ids);
      } catch (e) {}
      if (S.runTab) {
        overlay.innerHTML = runRecapHtml();
        bindRunRecap();
      } else {
        overlay.innerHTML = "<p class=\"k\">" + t("rekt") + (S.ranked ? "" : " · " + t("trainCamp")) + "</p><h1>" + fmtBtc(netBtc()) + "</h1><p>" + money(S.cash) + " + " + fmtBtc(S.btc) + " @ " + money(S.price) + "</p><p class=\"k\">" + (S.ranked ? t("best") + " " + fmtBtc((S.best || 0) / 1e4) : t("trainNote")) + "</p><div class=\"overlay-actions\"><button class=\"cta\" id=\"go\">" + t("tryAgain") + "</button><button type=\"button\" class=\"cta play-alt\" id=\"run-stats\">" + t("runStats") + "</button><button type=\"button\" class=\"cta play-alt\" id=\"share-run\">" + t("share") + "</button></div>";
        if ($("go")) {
          $("go").onclick = replay;
          $("go").onpointerdown = (e) => { e.stopPropagation(); replay(); };
        }
        if ($("run-stats")) $("run-stats").onclick = (e) => { e.stopPropagation(); S.runTab = "stats"; renderOverlay(); };
        if ($("share-run")) $("share-run").onclick = () => shareRun("over");
      }
    } else if (p === "win" && S.stats) {
      mergeAwards(runAwardIds(S.stats));
      if (S.runTab) {
        overlay.innerHTML = runRecapHtml();
        bindRunRecap();
      } else {
        overlay.innerHTML = "<p class=\"k\">TWENTY ONE MILLION</p><h1>" + t("congrats") + "</h1>"
          + "<p>" + t("stacked") + "</p>"
          + "<div class=\"overlay-actions\"><button class=\"cta\" id=\"go\">" + t("keepPlaying") + "</button><button type=\"button\" class=\"cta play-alt\" id=\"run-stats\">" + t("runStats") + "</button><button type=\"button\" class=\"cta play-alt\" id=\"go-again\">" + t("playAgain") + "</button><button type=\"button\" class=\"cta play-alt\" id=\"share-run\">" + t("share") + "</button></div>";
        if ($("go")) $("go").onclick = keepPlaying;
        if ($("run-stats")) $("run-stats").onclick = (e) => { e.stopPropagation(); S.runTab = "stats"; renderOverlay(); };
        if ($("go-again")) $("go-again").onclick = replay;
        if ($("share-run")) $("share-run").onclick = () => shareRun("win");
      }
    }
  }

  let last = performance.now(), acc = 0, hudAcc = 0;
  function mpCatchUp() {
    if (!S.mp || S.phase !== "play" || !S.mpPlayAt) return;
    const target = Math.max(0, (Date.now() - S.mpPlayAt) / 1000);
    let guard = 0;
    while (S.lifeT + 1 / 60 <= target && guard++ < 1800) step(1 / 60);
  }
  function mpTickClock() {
    if (S.phase === "count" && S.mp && S.mpPlayAt) {
      const ms = S.mpPlayAt - Date.now();
      const n = ms > 0 ? Math.min(3, Math.max(1, Math.ceil(ms / 1000))) : 0;
      if (n !== S.countN) { S.countN = n; try { renderOverlay(); } catch (e) {} }
      if (ms <= 0) startMpPlay();
    }
    if (S.mp && S.phase === "play") mpCatchUp();
    if (S.mp && S.mpRoundOver && S.mpNextAt) {
      const left = S.mpNextAt - Date.now();
      const sec = Math.max(0, Math.ceil(left / 1000));
      if (left <= 0) {
        S.mpNextAt = 0;
        const host = window.ChoppyMP && window.ChoppyMP.get && window.ChoppyMP.get().host;
        if (host && window.ChoppyMP.nextRound) window.ChoppyMP.nextRound();
      } else if (S.mpNextShown !== sec) {
        S.mpNextShown = sec;
        if (S.phase === "play" && !S.runTab) try { renderOverlay(); } catch (e) {}
      }
    }
  }
  function loop(now) {
    mpTickClock();
    if (S.mp && S.phase === "play") {
      last = now;
      acc = 0;
    } else if (!(S.mp && S.phase === "count")) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now; acc += dt;
      while (acc >= 1 / 60) { step(1 / 60); acc -= 1 / 60; }
    } else {
      last = now;
    }
    hudAcc += 0.016;
    const ctx = fit();
    if(S.phase==="defense") drawDefense(ctx); else draw(ctx);
    paintHeroPreview();
    if (hudAcc > 0.12) { renderHud(); hudAcc = 0; }
    requestAnimationFrame(loop);
  }
  setInterval(mpTickClock, 250);
  document.addEventListener("visibilitychange", mpTickClock);
  window.addEventListener("focus", mpTickClock);
  window.addEventListener("pageshow", mpTickClock);

  canvas.addEventListener("pointerdown", (e) => {
    if (flapBlocked(e)) return;
    e.preventDefault();
    if (A && A.unlock) try { A.unlock(); } catch (err) {}
    S.humanInput = true;
    if(S.phase==="defense"){defenseInput(e.clientX,true);return;}
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
    else if (S.phase === "win") keepPlaying();
    else if (S.phase === "over") replay();
    else if (S.phase === "paused" || S.optPanel) {
      S.optPanel = null;
      S.arcHold = false;
      setPhase(S.optBack === "play" || S.phase === "paused" ? (S.optBack || "play") : "ready");
    }
  });
  window.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName ? e.target.tagName : "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || tag === "select" || (e.target && e.target.isContentEditable);
    if (typing) return;
    if (document.querySelector(".modal.open, .modal.show, #modal-auth.open, #auth-modal.open")) return;
    const k = e.key.toLowerCase();
    if(S.phase==="defense"){if(e.code==="Space"||e.code==="ArrowUp"){e.preventDefault();defenseInput(canvas.getBoundingClientRect().left+(S.bcDefense.x/480)*canvas.getBoundingClientRect().width,true);}else if(k==="a"||e.code==="ArrowLeft"){S.bcDefense.x=Math.max(28,S.bcDefense.x-(S.bcDefense.up.mob?29:24));}else if(k==="d"||e.code==="ArrowRight"){S.bcDefense.x=Math.min(452,S.bcDefense.x+(S.bcDefense.up.mob?29:24));}return;}
    if (S.arcHold || S.phase === "chance") {
      if (e.code === "Space" || e.code === "ArrowUp" || k === "p") { e.preventDefault(); return; }
    }
    if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); if (!e.repeat) flap(); }
    else if (k === "b") { e.preventDefault(); if (!aiLocks().trade) { buyBtc(); unstickTrades(); renderHud(); } }
    else if (k === "s") { e.preventDefault(); if (!aiLocks().trade) { sellBtc(); unstickTrades(); renderHud(); } }
    else if (k === "p") { e.preventDefault(); if (!S.mp) togglePause(); }
  });
  $("pause-btn").onpointerdown = (e) => { e.stopPropagation(); e.preventDefault(); if (!S.mp) togglePause(); };
  function optionsVisible() {
    if (S.phase === "chance") return !!(S.optPanel && S.optPanel !== "off");
    if (S.phase === "ready") return !!(S.optPanel && S.optPanel !== "off");
    if (S.phase === "paused") {
      if (S.optPanel === "off") return false;
      if (S.arcHold && !S.optPanel) return false;
      return true;
    }
    return false;
  }
  function toggleOptions() {
    if (S.mp) return;
    if (S.phase === "chance") {
      S.optPanel = optionsVisible() ? null : "menu";
      renderOverlay();
      return;
    }
    if (S.phase === "play") {
      S.optBack = "play";
      S.optPanel = "menu";
      setPhase("paused");
      return;
    }
    if (S.phase === "ready") {
      S.optBack = "ready";
      S.optPanel = optionsVisible() ? null : "menu";
      renderOverlay();
      return;
    }
    if (S.phase === "paused") {
      if (optionsVisible()) S.optPanel = S.arcHold ? null : "off";
      else S.optPanel = "menu";
      renderOverlay();
    }
  }
  const optBtn = $("opt-btn");
  if (optBtn) optBtn.onpointerdown = (e) => {
    e.stopPropagation(); e.preventDefault();
    toggleOptions();
  };
  const authHud = $("btn-show-auth");
  if (authHud) authHud.onpointerdown = (e) => {
    e.stopPropagation();
    if (S.mp) return;
    if (S.phase === "play") { S.optBack = "play"; S.optPanel = null; setPhase("paused"); }
  };
  window.pauseChoppyForAuth = function () {
    if (S.mp) return;
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
    if (!S.aibudOn) { S.aibudLit = {}; S.aibudLitAt = {}; }
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
    if ((S.have.market || 0) <= 0 || S.mp) return;
    S.optBack = S.phase === "play" ? "play" : (S.optBack || "ready");
    S.optPanel = "market";
    if (S.phase === "play") setPhase("paused");
    else renderOverlay();
  };
  $("buy-btc").onpointerdown = (e) => {
    e.stopPropagation();
    if (aiLocks().trade) return;
    buyBtc();
    clearManualTradePaint();
    renderHud();
  };
  $("sell-btc").onpointerdown = (e) => {
    e.stopPropagation();
    if (aiLocks().trade) return;
    sellBtc();
    clearManualTradePaint();
    renderHud();
  };
  function keepAiTradeLit(id) {
    return !!(S.aibudOn && S.aibudLit && ((id === "buy-btc" && S.aibudLit.buy) || (id === "sell-btc" && S.aibudLit.sell)));
  }
  function clearManualTradePaint() {
    ["buy-btc", "sell-btc"].forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.classList.remove("on", "press");
      if (!keepAiTradeLit(id)) el.classList.remove("ai-lit");
      try { el.blur(); } catch (err) {}
    });
    setTimeout(() => {
      ["buy-btc", "sell-btc"].forEach((id) => {
        const el = $(id);
        if (!el) return;
        el.classList.remove("on", "press");
        if (!keepAiTradeLit(id)) el.classList.remove("ai-lit");
        try { el.blur(); } catch (err) {}
      });
    }, 80);
  }
  function unstickTrades() { clearManualTradePaint(); }
  const unstickTrade = (id) => {
    const el = $(id);
    if (!el) return;
    const release = () => {
      el.classList.remove("on", "press");
      if (!keepAiTradeLit(id)) el.classList.remove("ai-lit");
      try { el.blur(); } catch (err) {}
    };
    el.onpointerup = release;
    el.onpointercancel = release;
    el.onpointerleave = release;
    el.onlostpointercapture = release;
  };
  unstickTrade("buy-btc");
  unstickTrade("sell-btc");
  document.addEventListener("pointerup", unstickTrades, true);
  document.addEventListener("pointercancel", unstickTrades, true);
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
  const bcOpen=$("bc-open"),bcClose=$("bc-close"),bcArmy10=$("bc-army10"),bcDeclare=$("bc-declare");
  if(bcOpen)bcOpen.addEventListener("click",()=>{const p=$("bc-panel");if(p)p.classList.remove("hide");renderBitcoinCountry();});
  if(bcClose)bcClose.addEventListener("click",()=>{const p=$("bc-panel");if(p)p.classList.add("hide");});
  if(bcArmy10)bcArmy10.addEventListener("click",()=>{buyArmy(10);renderBitcoinCountry();});
  if(bcDeclare)bcDeclare.addEventListener("click",()=>{if((S.bcNodes||0)<100||S.bcIndependent)return;S.bcIndependent=true;S.chanceUsed.theQuestion=true;const p=$("bc-panel");if(p)p.classList.add("hide");dealChance();});
  window.startChoppy = startGame;
  window.replayChoppy = replay;
  window.dealChoppyArc = function (id) {
    window.__arcForce = id || "";
    if ((S.have.chance || 0) < 1) S.have.chance = 1;
    if (S.phase !== "play") S.phase = "play";
    dealChance();
  };
  window.offerChoppyPerk = function (ids) {
    S.perkOffers = (ids && ids.length) ? ids.slice() : ["dca", "aibud", "skip"];
    S.perkPick = "";
    S.perkHint = "";
    setPhase("perk");
  };
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
    preloadChanceArt();
    wireMp();
    try {
      const q = new URLSearchParams(location.search || "");
      const room = (q.get("room") || q.get("mp") || "").toUpperCase();
      if (room.length >= 4) { S.mpJoinCode = room; openMpLobby(); }
    } catch (e) {}
    requestAnimationFrame(loop);
  } catch (e) {
    try { console.error(e); } catch (err) {}
    try { renderOverlay(); } catch (err) {}
  }
})();
