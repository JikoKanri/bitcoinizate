Warning: truncated output (original token count: 99177)
Total output lines: 7804

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
      bg: "#2a1018", bgTop: "#4a1c16", bgBot: "#12080c", glow: "rgba(255,138,58,0.42)",
      fg: "#fff6ee", gold: "#ffb15a", ink: "#1a0808",
      line: "#4a2030", muted: "#f0c8b8", surface: "#221018", border: "#6a3040",
      hud: "#fff6ec", green: "#e8a040", red: "#ff7a72",
      grid: "rgba(255,138,58,0.12)", bullBg: "#181000", bearBg: "#180808",
      halo: "rgba(0,0,0,0.92)", labelUp: "#fff8ea", labelDn: "#ffd4cc",
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
    comingSoon: "COMING SOON",
    mpAlpha: "ALPHA",
    mpAlphaNote: "Alpha. Testers welcome. Send feedback to",
    donateTitle: "Donations",
    donateBody: "Donations keep the game going. 70% of every donation is distributed as leaderboard prizes.",
    boardBtc: "Most BTC",
    boardInd: "Fastest independence",
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
    testing: "Testing",
    testPerk: "Perk",
    testGrant: "Grant",
    testArc: "Candles per arc",
    testArcSet: "Set",
    testArcHint: "0 = default. Default is one random card inside every 21 candles.",
    testArcNext: "Next arc in {n} candles · passed {now}",
    testMoney: "Add money",
    testAdd: "Add",
    testQueued: "Applies when the run starts. Sticks for this session.",
    testBoard: "This run will not count for the board.",
    testMaxed: "Maxed",
    testNow: "Now",
    testRevealed: "Revealed",
    testPool: "Still in the pool",
    testCopy: "Copy",
    testCopied: "Copied",
    testNoneRevealed: "(none yet)",
    testNonePool: "(pool is empty)",
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

  function donateBlock() {
    const ln = "lnbc1p4tdeq9pp5v39yyvsws5swurns2gpmj64m469548f64t2cqjsfyka574fj0dasdqqcqzzgxqyz5vqrzjqf0wu22xsefd8gzu0m9n93g2khea86l6yy26en9v46g9e6hk7v9z8lytgux50yx2zuqqqqryqqqqthqqpyrzjqfwdd2w9y5ra5z3m4qetfa5ccu6432xfuvk6zrvg9vxwltvukd48dlytgux50yx2zuqqqqryqqqqthqqpysp5zc5j4qd90hqxklpcy4skg9rfl5aypv9rsmrypjdt62td8869kx0s9qrsgq43tqd4ujehpvccxw5rzkk8z74mk7sdhgga3tqtk3uwvtlj3tl3s3yhrv5vy5x8t6x2zfursvw7z82rqu4fmuttaj57ukyspx35np6zgq6tutga";
    const btc = "bc1q5yrmsvdh3m7ad03txs2h5ktw5zzdxwxrgeujsj0e25s83cffzauq4vgjez";
    return "<section class=\"donate-note\">"
      + "<h3 class=\"k\">" + t("donateTitle") + "</h3>"
      + "<p>" + t("donateBody") + "</p>"
      + "<p class=\"donate-links\"><a href=\"lightning:" + ln + "\">Lightning</a> · <a href=\"bitcoin:" + btc + "\">Bitcoin</a></p>"
      + "<p class=\"k\">" + t("faqPrizeA") + "</p>"
      + "</section>";
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
    if (!S.ranked || S.testCheat) return S.best || 0;
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
  function noteIndependence() {
    if (S.indepNoted || S.mp || !S.ranked || S.testCheat || S.humanInput === false) return;
    const life = Number(S.lifeT) || 0;
    const candles = S.candles || 0;
    if (life < 12 || candles < 3) return;
    S.indepNoted = true;
    S.indepAt = life;
    if (typeof window.submitIndependence === "function") window.submitIndependence(life, candles);
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
    testArcEvery: 0, testArcNext: 0, testPerkSeed: {}, testPerkPick: "dca", testCashOnce: 0, testBtcOnce: 0, testCur: "usd", testCheat: false,
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
    const base = 100;
    const n = Math.round(base * candyMul(tier));
    return "+" + String(Math.max(0, n)) + " usd";
  }

  function usdIntLabel(text) {
    let s = String(text == null ? "" : text);
    s = s.replace(/([+-]?)\$?\s*(\d+(?:\.\d+)?)k(?=\s*usd\b)/gi, (_, sig, num) => {
      const n = Math.round(Math.abs(Number(num) || 0) * 1000);
      return (sig === "-" ? "-" : "+") + String(n);
    });
    s = s.replace(/([+-]?)\$?\s*(\d+(?:\.\d+)?)(?=\s*usd\b)/gi, (_, sig, num) => {
      const n = Math.round(Math.abs(Number(num) || 0));
      return (sig === "-" ? "-" : "+") + String(n);
    });
    return s;
  }
  function grantUsd(n, x, y, kind) {
    n = Number(n) || 0;
    if (!(n > 0)) return 0;
    if (kind === "gain" && S.have.candy > 0) n *= candyMul();
    if (kind === "gain") n = Math.round(n);
    if (!(n > 0)) return 0;
    const px = x == null ? S.bird.x : x;
    const py = y == null ? S.bird.y - 24 : y;
    const wholeUsd = (v) => usdIntLabel("+" + String(Math.max(0, Math.round(Number(v) || 0))) + " usd");
    if (kind === "gain") {
      if (S.dcaOn && S.have.dca > 0 && clampPx(S.price) > 0) {
        const price = clampPx(S.price);
        const out = creditBtc(n / price);
        if (out.take <= 0 && out.cash <= 0) S.cash += n;
      } else {
        S.cash += n;
      }
      pop(px, py, wholeUsd(n), "#fffaf4", "gain");
      return n;
    }
    const usdPop = (v) => "+" + fmtAmt(v, "usd");
    if (S.dcaOn && S.have.dca > 0 && clampPx(S.price) > 0) {
      const price = clampPx(S.price);
      const want = n / price;
      const out = creditBtc(want);
      if (out.take > 0) pop(px, py, "+" + fmtAmt(out.take, "btc"), PAL.hud || BTC, kind);
      if (out.cash > 0) pop(px, py + (out.take > 0 ? 14 : 0), usdPop(out.cash), PAL.labelUp || GREEN, kind);
      if (out.take <= 0 && out.cash <= 0) {
        S.cash += n;
        pop(px, py, kind === "gain" ? usdPop(n) : "+" + n + " usd", GREEN, kind);
      }
    } else {
      S.cash += n;
      pop(px, py, kind === "gain" ? usdPop(n) : "+" + n + " usd", GREEN, kind);
    }
    return n;
  }

  function pop(x, y, text, color, kind) {
    const gain = kind === "gain";
    const shown = gain ? usdIntLabel(text) : text;
    const power = kind === "power";
    const flowerTalk = PALETTE_ID === "flower" && (gain || kind === "trade");
    S.floats.push({
      x, y, text: shown, color, kind: kind || "",
      life: gain || power ? 0.825 : 1.1,
      vy: gain || power ? -32 : -38,
      size: flowerTalk ? (gain ? 15 : 16) : (gain || power ? 7.35 * 1.05 : 13),
      maxA: flowerTalk ? 1 : (gain || power ? 0.75 : 0.875),
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
      S.jobName = ""; S.jobTrack = null; S.jobOffer = null; S.chanceAt = []; S.chanceUntil = 0; S.chanceUsed = {}; S.chanceCard = null; S.chanceNote = ""; S.chanceReadyNote = ""; S.chanceSettled = false; S.chanceMet = {}; S.chanceLead = ""; S.arcHold = false; S.arcTldr = ""; S.arcPending = null; S.hasRing=false; S.engaged=false; S.familyClosed=false; S.familyPath=false; S.arcSeen=[]; S.arcBias=""; S.bcBook=false; S.bcBookOffer=false; S.bcIslandOffer=0; S.bcIsland=false; S.bcOg=false; S.bcNodes=0; S.bcNodeTick=0; S.bcSettlement=false; S.bcPower=false; S.bcMine=false; S.bcCitadel=false; S.bcArmyUnlocked=false; S.bcArmy=0; S.bcWorld=20; S.bcIndependent=false; S.bcVictory=false; S.bcArcClosed=false; S.bcDefense=null; S.bcDefensePending=false; S.bcArmySpend=0; S.bcBattlesWon=0; S.bcAssaultAt=0; S.bcReactions=null; S.bcRepliesDone=false; S.indepNoted=false; S.indepAt=0;
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
      if (S.optPanel) { S.optPanel = null; renderOverlay(); return; }
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
  function fillJob(text) {
    const job = currentJob();
    const tier = Math.max(1, Math.min(7, S.have.job || 1));
    const es = chanceLang();
    const title = job ? jobTitleAt(job, tier) : (es ? "el puesto" : "the job");
    const career = job ? (es ? (job.nameEs || job.name) : job.name) : (es ? "el trabajo" : "work");
    const pay = jobPayAt(job, tier);
    const half = Math.max(1, Math.round(pay / 2));
    return String(text || "")
      .replace(/\{title\}/g, title)
      .replace(/\{career\}/g, career)
      .replace(/\{pay\}/g, money(pay))
      .replace(/\{half\}/g, money(half))
      .replace(/\{double\}/g, money(pay * 2));
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
    const got = Math.min(S.cash, Math.max(0, n)); S.cash -= got; return got;
  }
  function takeUsdEquivalent(n) {
    let need=Math.max(0,Number(n)||0), paid=0;
    const cash=Math.min(Math.max(0,S.cash||0),need); S.cash-=cash; need-=cash; paid+=cash;
    const px=clampPx(S.price);
    if(need>0&&px>0&&S.btc>0){const btc=Math.min(S.btc,need/px);S.btc-=btc;need-=btc*px;paid+=btc*px;}
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
  function payPlan(usdNeed) {
    const need = Math.max(0, Number(usdNeed) || 0);
    const cash = Math.max(0, S.cash || 0);
    const px = clampPx(S.price);
    const btc = Math.max(0, S.btc || 0);
    const btcUsd = btc * px;
    if (need <= 0.0001) return { cash: 0, btc: 0 };
    if (cash + 1e-6 >= need) return { cash: need, btc: 0 };
    if (btcUsd + 1e-6 >= need) return { cash: 0, btc: px > 0 ? need / px : 0 };
    return { cash: cash, btc: px > 0 ? Math.min(btc, Math.max(0, need - cash) / px) : 0 };
  }
  function formatPayCost(usdNeed) {
    const p = payPlan(usdNeed);
    const bits = [];
    if (p.cash > 0.49) bits.push(money(p.cash));
    if (p.btc > 1e-8) bits.push(fmtBtcAmt(p.btc) + " BTC");
    if (!bits.length) bits.push(money(usdNeed));
    return bits.join(" + ");
  }
  function formatSlicePct(p) {
    const cash = Math.max(0, (S.cash || 0) * p);
    const btc = Math.max(0, (S.btc || 0) * p);
    const bits = [];
    if (cash > 0.49) bits.push(money(cash));
    if (btc > 1e-8) bits.push(fmtBtcAmt(btc) + " BTC");
    if (!bits.length) bits.push(money(wealthUsd() * p));
    return bits.join(" + ");
  }
  function formatBagDelta(before, after) {
    const dCash = (after.cash || 0) - (before.cash || 0);
    const dBtc = (after.btc || 0) - (before.btc || 0);
    const bits = [];
    if (Math.abs(dCash) > 0.49) bits.push(money(Math.abs(dCash)));
    if (Math.abs(dBtc) > 1e-8) bits.push(fmtBtcAmt(Math.abs(dBtc)) + " BTC");
    return bits.join(" + ");
  }
  function arcCostUsd(card, k) {
    const pct = {
      landfill: { a: .25, b: .75 }, nicoWedding: { a: .04, b: .006 }, mexico: { a: .08 },
      phish: { a: .18 }, casino: { a: .1, b: .3 }, poker: { a: .08, b: .25 }, startup: { a: .2 },
      courage: { a: .06 }, ring: { a: .08, b: .03 }, proposal: { a: .02, c: .01 },
      wedding: { a: .12, b: .05, c: .01 }, honeymoon: { a: .1, b: .06, c: .04 },
      baby: { a: .05, b: .02 }, cousin: { a: .4 }, potluck: { a: .05 }, usedcar: { a: .12 },
      peopleAsking: { a: .03 }, extensionCord: { a: .04 }, obviously: { a: .05 },
      protectIsland: { a: .02 }, citadelQuestion: { a: .08 }
    };
    if (pct[card.id] && pct[card.id][k] != null) return wealthUsd() * pct[card.id][k];
    const bill = {
      pieceWorld: { a: 1800 }, nobodyKnows: { a: 5000 }, stateVisit: { a: 15000, b: 5000 },
      protectIsland: { b: 50000 }, ortegaCalls: { a: 25000 }, school: { a: 300 },
      date: { a: 180, b: 60 }, wine: { b: 17, c: 25 }, tetris: { a: 20 },
      unclemike: { a: 220, b: 180, c: 195 },
      blocReplies: { a: 40000 }
    };
    if (card.id === "islandInspection" && k === "a") return S.bcIslandOffer || 0;
    if (bill[card.id] && bill[card.id][k] != null) return bill[card.id][k];
    return null;
  }
  function arcOptionLabel(card, o, es) {
    let lab = es ? (o.labelEs || o.label) : o.label;
    lab = lab.replace(/\s*·\s*\d+(?:\.\d+)?%\s*(?:of net worth|del patrimonio)?/gi, "");
    lab = lab.replace(/\s+\d+(?:\.\d+)?%\s+of net worth/gi, "");
    lab = lab.replace(/\s+\d+(?:\.\d+)?%\s+del patrimonio/gi, "");
    lab = lab.replace(/\s*·\s*\$[\d,]+(?:\.\d+)?/g, "");
    lab = lab.replace(/\s+\d+(?:\.\d+)?%\s*$/g, "");
    lab = lab.replace(/\s+·\s*$/g, "").trim();
    if (card.id === "landfill" && (o.k === "a" || o.k === "b")) {
      return lab + " · " + formatSlicePct(o.k === "b" ? 0.75 : 0.25);
    }
    if (card.id === "anOffer" && o.k === "a") {
      return lab + " · +" + formatPayCost(wealthUsd() * 0.35);
    }
    const usd = arcCostUsd(card, o.k);
    if (usd != null && usd > 0) return lab + " · " + formatPayCost(usd);
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
    justInCase: { en: "A new emergency law widens government power whenever the economy looks unstable. They call it temporary. The definition seems to cover most years.", es: "Una ley de emergencia amplía el poder del Estado cuando la economía se ve inestable. La llaman temporal. La definición parece cubrir casi todos los años." },
    nothingToHide: { en: "An optional digital ID makes travel and banking easier, and public services start moving onto it. You have nothing to hide. The question still bothers you.", es: "Un DNI digital opcional hace más fáciles los viajes y los bancos, y los trámites empiezan a mudarse ahí. No tenés nada que ocultar. La pregunta igual molesta." },
    somethingBetter: { en: "On a run with Marek you say that, with enough money, you could build something better than a company or a charity. You do not yet know what.", es: "En una corrida con Marek decís que, con suficiente plata, podrías construir algo mejor que una empresa o una ONG. Todavía no sabés qué." },
    timeTraveler: { en: "An old post claims to be from a future of citadels. A search turns up a self-published book, THE BITCOIN STATE, for $666.", es: "Un post viejo dice venir de un futuro de ciudadelas. Una búsqueda te lleva a un libro autoeditado, THE BITCOIN STATE, a $666." },
    temporaryMeasures: { en: "A financial emergency brings transfer limits and payment apps that stop working. Officials say it is temporary. Bitcoin does not fall with the markets.", es: "Una emergencia financiera trae límites a las transferencias y apps de pago que dejan de andar. Dicen que es temporal. Bitcoin no cae con los mercados." },
    citadelProblem: { en: "You tell Marek you want to build a country. He laughs, then asks how much land. The stupid idea now has a checklist.", es: "Le decís a Marek que querés construir un país. Se ríe, y después pregunta cuánta tierra. La idea estúpida ahora tiene una lista." },
    pieceWorld: { en: "Nico finds a listing for an isolated island that calls itself a sovereign opportunity. It is not sovereign.", es: "Nico encuentra el aviso de una isla aislada que se vende como una oportunidad soberana. No es soberana." },
    islandInspection: { en: "At sunrise the island is more beautiful than the listing. At sunset the seller's offer arrives.", es: "Al amanecer la isla es más linda que el aviso. Al atardecer llega la oferta del vendedor." },
    paperwork: { en: "Lawyers turn the purchase into something that looks serious. Nico signs in the wrong place. Paco eats a corner of the last page.", es: "Los abogados hacen que la compra se vea seria. Nico firma en el lugar equivocado. Paco se come una esquina de la última hoja." },
    nobodyKnows: { en: "You have land and paperwork, and almost no reason for anyone to care. The only name you are given is Madame Luck.", es: "Tenés tierra y papeles, y casi ningún motivo para que a alguien le importe. El único nombre que te dan es Madame Luck." },
    theOg: { en: "Madame Luck asks very good questions, says she will tell some people, and your phone starts vibrating.", es: "Madame Luck hace muy buenas preguntas, dice que se lo va a contar a alguna gente, y el teléfono empieza a vibrar." },
    peopleAsking: { en: "People ask if they can move in. Nico makes a spreadsheet. There are no houses.", es: "La gente pregunta si puede mudarse. Nico arma una planilla. No hay casas." },
    extensionCord: { en: "The new residents bring more machines than the island can feed. The lights go out. Someone asks who was mining.", es: "Los residentes nuevos traen más máquinas de las que la isla puede alimentar. Se corta la luz. Alguien pregunta quién estaba minando." },
    obviously: { en: "The grid works. Nico says you should mine Bitcoin. The proposal is four words: cheap power, we mine.", es: "La red anda. Nico dice que habría que minar Bitcoin. La propuesta tiene cuatro palabras: energía barata, minamos." },
    principality: { en: "Mr Ortega & Gambette writes from San Arnaldo. They have a flag, an anthem, and a website. They would like relations.", es: "Escribe el señor Ortega & Gambette desde San Arnaldo. Tienen bandera, himno y sitio web. Quieren relaciones." },
    stateVisit: { en: "San Arnaldo wants Bitcoin infrastructure. Their government building may have been a restaurant. You want friends.", es: "San Arnaldo quiere infraestructura Bitcoin. El edificio de gobierno pudo haber sido un restorán. Vos querés amigos." },
    firstBloc: { en: "Seven capitals announce the Meridian Stability Pact. Chancellor Voss never raises his voice. The Pact looks like a form, and the form is mandatory.", es: "Siete capitales anuncian el Pacto de Estabilidad Meridiano. El canciller Voss no alza la voz. El Pacto parece un formulario, y el formulario es obligatorio." },
    protectIsland: { en: "Someone steals a boat. The island's security is one camera and Paco, and Paco was asleep.", es: "Alguien se roba un bote. La seguridad de la isla es una cámara y Paco, y Paco estaba dormido." },
    placeNow: { en: "A coffee shop, a bakery, a bar, and a newspaper appear. The first editorial criticizes you. Nico is delighted.", es: "Aparecen un café, una panadería, un bar y un diario. El primer editorial te critica. Nico está encantado." },
    citadelQuestion: { en: "Marek brings plans for walls and a hardened center and calls it a citadel. A wall can keep people out, or keep them safe.", es: "Marek trae planos de muros y un centro reforzado y lo llama ciudadela. Un muro puede dejar gente afuera, o cuidarla." },
    rearmament: { en: "The Pact launches frigates and calls it maintenance. Five states answer with the Red Ledger and a language of purity. Both sides lay keels.", es: "El Pacto lanza fragatas y lo llama mantenimiento. Cinco Estados responden con el Libro Rojo y un idioma de pureza. Los dos lados ponen quillas." },
    anOffer: { en: "A private group offers {offer} for the whole project. Madame Luck asks why you built it.", es: "Un grupo privado ofrece {offer} por todo el proyecto. Madame Luck pregunta por qué lo construiste." },
    ambassador: { en: "A real ambassador visits and says that if this ever becomes more than a project, call her first.", es: "Visita una embajadora de verdad y dice que si esto alguna vez es más que un proyecto, la llames primero." },
    threeColors: { en: "The Crown Lattice closes the map. High Warden Soren Pell does not wave. He thinks a people who will not kneel are a clerical error.", es: "La Celosía de la Corona cierra el mapa. El Alto Guardián Soren Pell no saluda. Cree que un pueblo que no se arrodilla es un error de archivo." },
    ortegaCalls: { en: "Mr Ortega & Gambette calls with a thick stack of advice about recognition, treaties, fisheries, and seating.", es: "El señor Ortega & Gambette llama con un montón de consejos sobre reconocimiento, tratados, pesca y quién se sienta dónde." },
    theQuestion: { en: "The checklist is finally dangerous. Marek looks at the last open line. Independence.", es: "La lista por fin es peligrosa. Marek mira la última línea abierta. Independencia." },
    declaration: { en: "You declare independence. San Arnaldo recognizes Bitcoin Country almost at once. Ortega sends a thumbs-up and an attachment.", es: "Declarás la independencia. San Arnaldo reconoce Bitcoin Country casi enseguida. Ortega manda un pulgar arriba y un adjunto." },
    theAnswer: { en: "The blocs have already answered.", es: "Los bloques ya contestaron." },
    fourthColor: { en: "All three blocs attacked and failed. The island is still standing, and Bitcoin Country is independent.", es: "Los tres bloques atacaron y fallaron. La isla sigue en pie, y Bitcoin Country es independiente." },
    notYet: { en: "The defense fails. The run ends.", es: "La defensa falla. La partida termina." },
    landfill: { en: "At 1:14 a.m. Nico wants a partner to dig for a USB that supposedly held 8,000 BTC.", es: "A la 1:14 a. m., Nico busca un socio para recuperar de un vertedero una memoria USB que supuestamente contenía 8,000 BTC." },
    taxbill: { en: "The quarterly tax bill arrives. You open it twice. The number has not changed. It is {gift}.", es: "Llega la factura trimestral de impuestos. La abres dos veces, pero el monto no cambia: {gift}." },
    nicoWedding: { en: "Nico is getting married. You barely know the room. Lena asks you not to let him talk you into anything.", es: "Nico se casa. Apenas conoces a la gente del salón y Lena te pide que no permitas que él te convenza de nada. En la mesa de regalos debes decidir cuánto dar." },
    mexico: { en: "Lena wants a few days in Tulum, and she wants to stay longer than you do. Paco eats one of the brochures.", es: "Lena quiere unos días en Tulum, y quiere quedarse más de lo que vos querés. Paco se come uno de los folletos." },
    flu: { en: "Lena has the flu. You spend the day on soup and medicine. Paco eats half the soup.", es: "A Lena le da gripe. Pasás el día con sopa y remedio. Paco se come la mitad de la sopa." },
    phish: { en: "Support emails you and asks for your seed phrase. It looks extremely convincing.", es: "Soporte te escribe y pide tu seed. Se ve extremadamente convincente." },
    crash: { en: "A delivery scooter hits the car slowly. Nobody is really hurt. Everyone apologizes more than they need to.", es: "Un scooter de delivery pega el auto despacio. Nadie sale realmente lastimado. Todos se disculpan de más." },
    wine: { en: "Friday at Marek's is wine and 12 Monkeys on pause. The talk turns to A.I., as usual. Neither of you wins.", es: "El viernes en lo de Marek hay vino y 12 Monkeys en pausa. La charla deriva a la I.A., como siempre. Ninguno gana." },
    casino: { en: "Nico calls late. He found a table at a casino and has already decided the game is interesting.", es: "Nico llama tarde. Encontró una mesa en un casino y ya decidió que el juego es interesante." },
    poker: { en: "Marek invites you to a late poker game with people he knows. It is not a casino. He nods when you say you are playing.", es: "Marek te invita a un póker de madrugada con gente que conoce. No es un casino. Asiente cuando decís que jugás." },
    uncle: { en: "Uncle Héctor wires you {gift} and refuses to say why.", es: "El tío Héctor te gira {gift} y se niega a decir por qué." },
    school: { en: "Sofi is going on a school trip to the Mint Museum, and her family is short this month. Lena thinks you should help.", es: "Sofi se va de viaje de estudio al museo de la Casa de Moneda, y en casa este mes están justos. Lena cree que deberías ayudar." },
    roof: { en: "Paco finds the leak and sits under it. When the workers arrive, he finds another place to sit.", es: "Paco encuentra la gotera y se sienta debajo. Cuando llegan los de la obra, encuentra otro lugar donde sentarse." },
    lotto: { en: "Over wine with Marek you buy a scratch ticket. In the morning he asks if you checked the numbers. You did not.", es: "Tomando vino con Marek comprás un raspa y gana. A la mañana pregunta si miraste los números. No los miraste." },
    hospital: { en: "You need stitches. Lena drives you to the hospital and, on the way home, tells you not to bleed on anything.", es: "Necesitás puntos. Lena te lleva al hospital y, de vuelta, te dice que no sangres sobre nada." },
    startup: { en: "Nico has a long deck for an app that mixes subscriptions, A.I., and something he calls community ownership. He says the upside is enormous.", es: "Nico tiene una presentación larga para una app que mezcla suscripciones, I.A. y algo que llama community ownership. Dice que el upside es enorme." },
    tow: { en: "You were parked in the wrong place. The sign was very clear.", es: "Estacionaste mal. El cartel estaba muy claro." },
    courage: { en: "At Marek's, with 12 Monkeys paused, you mention Lena. He says you may be waiting for certainty, then presses play.", es: "En lo de Marek, con 12 Monkeys en pausa, nombrás a Lena. Dice que capaz estás esperando certeza, y le da play." },
    ring: { en: "You are in the jewelry store, and you know why. You do not know which diamond looks responsible.", es: "Estás en la joyería y sabés por qué. No sabés qué diamante te hace ver responsable." },
    date: { en: "The restaurant, the walk, and the lake all go fine. Nothing goes wrong. That feels suspicious.", es: "El restorán, la caminata y el lago salen bien. No pasa nada malo. Eso se siente sospechoso." },
    proposal: { en: "The lake is getting dark and the ring is in your pocket. You ask Lena to marry you. She says yes.", es: "El lago se oscurece y el anillo está en el bolsillo. Le pedís a Lena que se case con vos. Dice que sí." },
    wedding: { en: "You and Lena are getting married. There are more decisions than you expected. Most of hers win.", es: "Se casan con Lena. Hay más decisiones de las que esperabas. Ganan casi todas las de ella." },
    honeymoon: { en: "You and Lena leave with one rule: no checking the portfolio. She takes your phone. There are three possible trips.", es: "Se van con una regla: no mirar el portfolio. Ella te saca el teléfono. Hay tres viajes posibles." },
    pregnancy: { en: "Two lines on a test. You and Lena are going to have a baby. The first costs come to $450.", es: "Dos rayas en un test. Van a tener un hijo con Lena. Los primeros gastos son $450." },
    baby: { en: "The baby arrives. Everyone is tired, including Paco. You start thinking about the future you want.", es: "Llega el bebé. Todos están cansados, Paco también. Empezás a pensar en el futuro que querés." },
    cousin: { en: "Nico found a new token. He says it will multiply by Friday. What it does, he says, is not the important part.", es: "Nico encontró un token nuevo. Dice que se multiplica para el viernes. Qué hace, dice, no es la parte importante." },
    speeding: { en: "You are a little over the limit. Same corner. Same officer. Same bad decision.", es: "Vas un poco arriba del límite. La misma esquina. El mis…49177 tokens truncated…e, finished: false,
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
    const jobEl = $("job-title");
    const powEl = $("status-powers");
    if (powEl) { powEl.textContent = powers; powEl.classList.toggle("hide", !powers); }
    if (jobEl) {
      jobEl.textContent = S.jobName || "";
      jobEl.classList.toggle("hide", !S.jobName || S.phase !== "play");
    }
    $("status").classList.toggle("hide", !(powers && S.phase === "play"));
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
    paintHaloText(ctx, "▲ B buy", 10, H - 12, PAL.labelUp || GREEN);
    paintHaloText(ctx, "▼ S sell", 96, H - 12, PAL.labelDn || RED);
  }
  const AWARD_CATALOG = [
    { id: "maxi", name: "Maxi Soul", nameEs: "Alma maxi", why: "Never sold BTC — not by hand, not by A.I. bud.", whyEs: "Nunca vendió BTC, ni a mano ni por A.I. bud." },
    { id: "halver", name: "Halving Catcher", nameEs: "Atrapa halvings", why: "Every halving that spawned was eaten.", whyEs: "Comió todos los halvings que salieron." },
    { id: "nocoiner", name: "Nocoiner", nameEs: "Nocoiner", why: "Never bought BTC in that run.", whyEs: "Nunca compró BTC en esa partida." },
    { id: "greedy", name: "Greedy Miner", nameEs: "Minero greedy", why: "Ate 0 halvings.", whyEs: "Comió 0 halvings." },
    { id: "opsec", name: "Opsec Warrior", nameEs: "Guerrero opsec", why: "Lost 0 cold storage.", whyEs: "No perdió cold storage." },
    { id: "paper", name: "Paper Hands", nameEs: "Manos de papel", why: "Sold BTC in a bear market.", whyEs: "Vendió BTC en un bear market." },
    { id: "fourth", name: "The Fourth Color", nameEs: "El cuarto color", why: "Bitcoin Country survived the attack.", whyEs: "Bitcoin Country sobrevivió el ataque." }
  ];
  function grantAward(id) {
    if (!id) return;
    const map = loadAwards();
    map[id] = true;
    saveAwards(map);
  }
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

  function testInRun() {
    return S.phase === "paused" || S.phase === "perk" || S.phase === "chance" || S.phase === "play";
  }
  function testSeedOf(id) {
    return (S.testPerkSeed && S.testPerkSeed[id]) || 0;
  }
  function applyTestLoadout() {
    S.testCheat = false;
    let cheated = false;
    const seed = S.testPerkSeed || {};
    Object.keys(seed).forEach((k) => {
      const n = seed[k] | 0;
      for (let i = 0; i < n; i++) grantPerk(k);
      if (n > 0) cheated = true;
    });
    if ((S.testArcEvery | 0) > 0) {
      S.testArcNext = (S.candles || 0) + (S.testArcEvery | 0);
      cheated = true;
    }
    if (S.testCashOnce > 0) { S.cash += S.testCashOnce; S.testCashOnce = 0; cheated = true; }
    if (S.testBtcOnce > 0) { creditBtc(S.testBtcOnce); S.testBtcOnce = 0; cheated = true; }
    if (cheated) S.testCheat = true;
  }
  function testGrantPerk(kind) {
    if (!kind || !PERK_MAX[kind]) return;
    const cap = PERK_MAX[kind];
    const cur = testInRun() ? (S.have[kind] || 0) : testSeedOf(kind);
    if (cur >= cap) return;
    if (!S.testPerkSeed) S.testPerkSeed = {};
    S.testPerkSeed[kind] = testSeedOf(kind) + 1;
    S.testPerkPick = kind;
    S.testCheat = true;
    if (testInRun()) grantPerk(kind);
    try { renderHud(); } catch (e) {}
  }
  function testSetArcEvery(n) {
    let v = Math.floor(Number(n));
    if (!isFinite(v) || v < 0) v = 0;
    if (v > 999) v = 999;
    S.testArcEvery = v;
    if (v > 0) {
      S.testCheat = true;
      S.testArcNext = (S.candles || 0) + v;
      return;
    }
    S.testArcNext = 0;
    if (!testInRun()) return;
    if ((S.have.chance || 0) > 0) planChanceWindow(S.candles || 0);
    else { S.chanceAt = []; S.chanceUntil = 0; }
  }
  function testAddMoney(amount, cur) {
    const n = Math.max(0, Number(amount) || 0);
    if (!(n > 0)) return;
    S.testCur = cur === "btc" ? "btc" : "usd";
    S.testCheat = true;
    if (!testInRun()) {
      if (S.testCur === "btc") S.testBtcOnce = (S.testBtcOnce || 0) + n;
      else S.testCashOnce = (S.testCashOnce || 0) + n;
      return;
    }
    if (S.testCur === "btc") creditBtc(n);
    else S.cash += n;
    try { renderHud(); } catch (e) {}
  }
  function testPerkOptionsHtml() {
    const pick = S.testPerkPick || "dca";
    const es = window.BZ && BZ.lang && BZ.lang() === "es";
    const pack = es ? PERK_NAME_ES : PERK_NAME;
    return Object.keys(PERK_MAX).map((id) => {
      const cap = PERK_MAX[id];
      const have = testInRun() ? (S.have[id] || 0) : testSeedOf(id);
      const name = pack[id] || id;
      return "<option value=\"" + id + "\"" + (id === pick ? " selected" : "") + ">" + name + " · " + have + "/" + cap + "</option>";
    }).join("");
  }
  function testArcStatus() {
    const n = S.testArcEvery | 0;
    if (n <= 0) return t("testArcHint");
    const left = testInRun()
      ? Math.max(0, (S.testArcNext || ((S.candles || 0) + n)) - (S.candles || 0))
      : n;
    const line = t("testArcNext").replace("{n}", String(left)).replace("{now}", String(S.candles || 0));
    return testInRun() ? line : line + " " + t("testQueued");
  }
  function testMoneyStatus() {
    if (testInRun()) return money(S.cash) + " · " + fmtBtc(S.btc);
    const bits = [];
    if (S.testCashOnce > 0) bits.push(money(S.testCashOnce));
    if (S.testBtcOnce > 0) bits.push(fmtBtc(S.testBtcOnce));
    if (!bits.length) return "—";
    return bits.join(" · ") + " · " + t("testQueued");
  }
  let testLogDraft = null;
  let testLogHold = false;
  function escTxt(s) {
    return String(s == null ? "" : s).split("&").join("&" + "amp;").split("<").join("&" + "lt;").split(">").join("&" + "gt;");
  }
  function arcCardLine(c) {
    const es = window.BZ && BZ.lang && BZ.lang() === "es";
    const title = (es && c.titleEs) ? c.titleEs : (c.title || c.id);
    return c.id + " — " + (c.job ? fillJob(title) : title);
  }
  function revealedArcText() {
    try {
      const used = S.chanceUsed || {};
      const byId = {};
      CHANCE_CARDS.forEach((c) => { byId[c.id] = c; });
      const seen = [];
      const push = (id) => {
        if (!id || seen.indexOf(id) >= 0) return;
        if (!used[id] && !(S.arcSeen && S.arcSeen.indexOf(id) >= 0) && !(S.chanceCard && S.chanceCard.id === id)) return;
        seen.push(id);
      };
      (S.arcSeen || []).forEach(push);
      Object.keys(used).forEach((id) => { if (used[id]) push(id); });
      if (S.chanceCard && S.chanceCard.id) push(S.chanceCard.id);
      const lines = seen.map((id) => {
        const c = byId[id];
        return c ? arcCardLine(c) : id;
      });
      return lines.length ? lines.join("\n") : t("testNoneRevealed");
    } catch (err) {
      return t("testNoneRevealed");
    }
  }
  function remainingArcText() {
    try {
      const lines = [];
      CHANCE_CARDS.forEach((c) => {
        if (S.chanceUsed && S.chanceUsed[c.id]) return;
        if (!arcUnlocked(c)) return;
        lines.push(arcCardLine(c));
      });
      return lines.length ? lines.join("\n") : t("testNonePool");
    } catch (err) {
      return t("testNonePool");
    }
  }
  function testLogValue() {
    const auto = revealedArcText();
    if (!testLogHold || testLogDraft == null) testLogDraft = auto;
    return testLogDraft;
  }
  function testMarkup() {
    const arcVal = S.testArcEvery > 0 ? S.testArcEvery : 0;
    const moneyVal = S.testCur === "btc" ? "0.1" : "10000";
    const note = (S.testCheat || (S.testArcEvery | 0) > 0 || S.testCashOnce > 0 || S.testBtcOnce > 0 || Object.keys(S.testPerkSeed || {}).some((k) => testSeedOf(k) > 0))
      ? "<p class=\"k\">" + t("testBoard") + "</p>" : "";
    return "<h1>" + t("testing") + "</h1><div class=\"test-box\">"
      + "<p class=\"test-lab\">" + t("testRevealed") + "</p>"
      + "<textarea id=\"test-arc-log\" class=\"test-log\" rows=\"8\" spellcheck=\"false\">" + escTxt(testLogValue()) + "</textarea>"
      + "<div class=\"test-row\">"
      + "<button type=\"button\" class=\"cta\" id=\"test-copy-log\">" + t("testCopy") + "</button>"
      + "</div>"
      + "<p class=\"test-lab\">" + t("testPool") + "</p>"
      + "<pre class=\"test-pool\" id=\"test-arc-pool\">" + escTxt(remainingArcText()) + "</pre>"
      + "<p class=\"test-lab\">" + t("testPerk") + "</p>"
      + "<div class=\"test-row\">"
      + "<select id=\"test-perk\">" + testPerkOptionsHtml() + "</select>"
      + "<button type=\"button\" class=\"cta\" id=\"test-grant\">" + t("testGrant") + "</button>"
      + "</div>"
      + "<p class=\"test-lab\">" + t("testArc") + "</p>"
      + "<div class=\"test-row\">"
      + "<input id=\"test-arc-n\" type=\"number\" min=\"0\" max=\"999\" inputmode=\"numeric\" value=\"" + arcVal + "\">"
      + "<button type=\"button\" class=\"cta\" id=\"test-arc-set\">" + t("testArcSet") + "</button>"
      + "</div>"
      + "<p class=\"k\" id=\"test-arc-status\">" + testArcStatus() + "</p>"
      + "<p class=\"test-lab\">" + t("testMoney") + "</p>"
      + "<div class=\"test-row\">"
      + "<input id=\"test-money\" type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" value=\"" + moneyVal + "\">"
      + "<select id=\"test-cur\">"
      + "<option value=\"usd\"" + (S.testCur === "btc" ? "" : " selected") + ">USD</option>"
      + "<option value=\"btc\"" + (S.testCur === "btc" ? " selected" : "") + ">BTC</option>"
      + "</select>"
      + "<button type=\"button\" class=\"cta\" id=\"test-add\">" + t("testAdd") + "</button>"
      + "</div>"
      + "<p class=\"k\">" + testMoneyStatus() + "</p>"
      + note
      + "</div><button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
  }

  function pauseMarkup() {
    const panel = S.optPanel || "";
    if (panel === "help") {
      return "<h1>" + t("howPlay") + "</h1>" + tutorialBody() + "<button class=\"cta\" id=\"help-back\">" + t("back") + "</button>";
    }
    if (panel === "market") {
      const mul = S.ranked ? 10 : 1;
      const cold = 1200 * mul, laser = 1800 * mul, msig = 9000 * mul;
      const book = S.bcBookOffer&&!S.bcBook ? "<button class=\"cta\" data-buy=\"bcbook\">THE BITCOIN STATE · $666</button>" : "";
      const island = S.bcIslandOffer&&!S.bcIsland&&S.chanceMet&&S.chanceMet.islandTrip ? "<button class=\"cta\" data-buy=\"bcisland\">The Island · "+money(S.bcIslandOffer)+"</button>" : "";
      return "<h1>" + t("market") + "</h1>"
        + "<p class=\"k\">" + money(S.cash) + "</p>" + book + island
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
    if (panel === "test") return testMarkup();
    const fromPlay = S.phase === "paused" && (S.optBack === "play" || !S.optBack);
    return "<h1>" + (fromPlay ? t("paused") : t("options")) + "</h1>"
      + "<div class=\"opt-menu\">"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-lang\">" + t("language") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-sound\">" + t("sound") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-gfx\">" + t("graphics") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-test\">" + t("testing") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item" + ((S.have.juke || 0) > 0 ? "" : " dim") + "\" id=\"opt-juke\">" + t("jukebox") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item" + ((S.have.aibud || 0) > 0 ? "" : " dim") + "\" id=\"opt-aibud\">" + t("aiLog") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-help\">" + t("tutorial") + "</button>"
      + "<button type=\"button\" class=\"cta opt-item\" id=\"opt-feed\">" + t("feedback") + "</button>"
      + "</div>"
      + (fromPlay ? "" : "<button class=\"cta\" id=\"opt-close\">" + t("back") + "</button>");
  }
  function bindPauseUi() {
    const go = $("go");
    if (go) go.onclick = () => {
      S.optPanel = null;
      if (S.optBack === "ready") { S.phase = "ready"; renderOverlay(); }
      else setPhase(S.optBack || "play");
    };
    const optClose = $("opt-close");
    if (optClose) optClose.onclick = (e) => {
      e.stopPropagation();
      S.optPanel = null;
      if (S.phase === "chance" || S.phase === "perk") { renderOverlay(); return; }
      if (S.optBack === "ready" || S.phase === "ready") { S.phase = "ready"; renderOverlay(); }
      else setPhase(S.optBack || "play");
    };
    const helpBack = $("help-back");
    if (helpBack) helpBack.onclick = (e) => { e.stopPropagation(); S.optPanel = "menu"; renderOverlay(); };
    overlay.querySelectorAll("[data-buy]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const kind = btn.getAttribute("data-buy");
        const mul = S.ranked ? 10 : 1;
        if(kind==="bcbook"){
          if(wealthUsd()<666){say("You cannot cover the $666 yet.",false);renderOverlay();return;}
          takeUsdEquivalent(666);S.bcBook=true;A.sfx.coin();renderOverlay();renderHud();return;
        }
        if(kind==="bcisland"){
          const cost=S.bcIslandOffer||0;
          if(!cost||S.bcIsland){renderOverlay();return;}
          if(wealthUsd()<cost){say("You cannot cover "+money(cost)+" yet.",false);renderOverlay();return;}
          takeUsdEquivalent(cost);S.bcIsland=true;A.sfx.coin();renderOverlay();renderHud();return;
        }
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
    const optTest = $("opt-test");
    if (optTest) optTest.onclick = (e) => {
      e.stopPropagation();
      testLogHold = false;
      testLogDraft = null;
      S.optPanel = "test";
      renderOverlay();
    };
    const testLog = $("test-arc-log");
    if (testLog) {
      testLog.onpointerdown = (e) => e.stopPropagation();
      testLog.onclick = (e) => e.stopPropagation();
      testLog.onkeydown = (e) => e.stopPropagation();
      testLog.oninput = (e) => {
        e.stopPropagation();
        testLogDraft = testLog.value;
        testLogHold = true;
      };
    }
    const testCopy = $("test-copy-log");
    if (testCopy) testCopy.onclick = (e) => {
      e.stopPropagation();
      const ta = $("test-arc-log");
      const text = ta ? ta.value : "";
      const done = () => {
        testCopy.textContent = t("testCopied");
        setTimeout(() => { if ($("test-copy-log")) $("test-copy-log").textContent = t("testCopy"); }, 1400);
      };
      const fallback = () => {
        try {
          if (ta) { ta.focus(); ta.select(); document.execCommand("copy"); }
        } catch (err) {}
        done();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else fallback();
    };
    const testGrant = $("test-grant");
    if (testGrant) testGrant.onclick = (e) => {
      e.stopPropagation();
      const sel = $("test-perk");
      testGrantPerk(sel ? sel.value : S.testPerkPick);
      renderOverlay();
    };
    const testArcSet = $("test-arc-set");
    const testArcInp = $("test-arc-n");
    const pushArc = () => {
      testSetArcEvery(testArcInp ? testArcInp.value : 0);
      const st = $("test-arc-status");
      if (st) st.textContent = testArcStatus();
    };
    if (testArcInp) testArcInp.oninput = (e) => { e.stopPropagation(); pushArc(); };
    if (testArcSet) testArcSet.onclick = (e) => { e.stopPropagation(); pushArc(); };
    const testAdd = $("test-add");
    if (testAdd) testAdd.onclick = (e) => {
      e.stopPropagation();
      const inp = $("test-money");
      const cur = $("test-cur");
      testAddMoney(inp ? inp.value : 0, cur ? cur.value : "usd");
      renderOverlay();
    };
    const testPerkSel = $("test-perk");
    if (testPerkSel) testPerkSel.onchange = (e) => { e.stopPropagation(); S.testPerkPick = testPerkSel.value; };
    const testCur = $("test-cur");
    if (testCur) testCur.onchange = (e) => { e.stopPropagation(); S.testCur = testCur.value; renderOverlay(); };
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
      return "<h1>" + t("versus") + " · " + t("mpAlpha") + "</h1><p class=\"k\">" + t("mpAlphaNote") + " <a href=\"mailto:versus@bitcoinizate.com\">versus@bitcoinizate.com</a></p><p class=\"k\">" + t("mpNote") + "</p>"
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
      S.mpJoinCode = inp ? inp.value : "";
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
    S.mp = false;
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
        if (S.phase === "mplobby" && !typing()) renderOverlay();
      } else if (ev === "reset") {
        S.mpOver = false;
        S.mpRoundOver = false;
        S.mp = false;
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
        if (S.phase === "mplobby") renderOverlay();
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
    if (p === "defense") {
      hideOverlay();
      overlay.classList.remove("chance-ui", "dock", "juke-ui", "mp-ui", "mp-spec");
      return;
    }
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
    overlay.classList.toggle("juke-ui", (p === "paused" || p === "ready" || p === "perk" || p === "chance") && S.optPanel === "juke");
    overlay.classList.toggle("test-ui", S.optPanel === "test");
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
          + "<button type=\"button\" class=\"cta play-alt\" id=\"go-mp\">" + t("versus") + "<small class=\"alpha-tag\">" + t("mpAlpha") + "</small></button>"
          + "<p class=\"k\">" + t("mpAlphaNote") + " <a href=\"mailto:versus@bitcoinizate.com\">versus@bitcoinizate.com</a></p>"
          + (window.choppySignedIn ? "" : "<button type=\"button\" class=\"cta play-alt\" id=\"overlay-auth\">" + t("signIn") + "</button>")
          + tutorialBody()
          + awardListHtml(loadAwards(), "full")
          + "<h3 class=\"k\">" + t("boardBtc") + "</h3><pre id=\"ready-board\" class=\"board\">—</pre>"
          + "<h3 class=\"k\">" + t("boardInd") + "</h3><pre id=\"ready-indep\" class=\"board\">—</pre>"
          + "<h3 class=\"k\">" + t("eloBoard") + "</h3><pre id=\"ready-elo\" class=\"board\">—</pre>"
          + donateBlock();
        $("go").onclick = () => startGame(true);
        $("go").onpointerdown = (e) => { e.stopPropagation(); startGame(true); };
        if ($("go-train")) {
          $("go-train").onclick = () => startGame(false);
          $("go-train").onpointerdown = (e) => { e.stopPropagation(); startGame(false); };
        }
        const mpGo = $("go-mp");
        if (mpGo) {
          mpGo.onclick = () => openMpLobby();
          mpGo.onpointerdown = (e) => { e.stopPropagation(); openMpLobby(); };
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
      let title = es ? (card.titleEs || card.title) : card.title;
      if (card.job) title = fillJob(title);
      const body = S.chanceBody || (es ? (card.bodyEs || card.body) : card.body);
      const pic = chanceArtHtml(card.id);
      let btns = "";
      if (S.chanceNote) {
        btns = "<button class=\"cta\" data-ch=\"ok\">" + t("chanceAck") + "</button>";
        overlay.innerHTML = arcTldrBtn() + "<h1>" + t("chanceHead") + "</h1>" + pic + "<p class=\"k\">" + title + "</p>"
          + arcOutcomeHtml()
          + "<div class=\"arc-actions\">" + btns + "</div>";
      } else {
        btns = (card.opts || []).map((o) => {
          const lab = arcOptionLabel(card,o,es);
          return "<button class=\"cta\" data-ch=\"" + o.k + "\">" + lab + "</button>";
        }).join("");
        const ack = !btns;
        if (ack) btns = "<button class=\"cta\" data-ch=\"ok\">" + t("chanceAck") + "</button>";
        overlay.innerHTML = arcTldrBtn() + "<h1>" + t("chanceHead") + "</h1>" + pic + "<p class=\"k\">" + title + "</p>"
          + arcStoryHtml(card, body)
          + "<div class=\"arc-actions\">" + btns + "</div>";
      }
      const tog = $("arc-tldr-tog");
      if (tog) tog.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setArcTldr(!ARC_TLDR);
        renderOverlay();
      };
      overlay.querySelectorAll("[data-ch]").forEach((btn) => {
        const go = (e) => { e.preventDefault(); e.stopPropagation(); pickChance(btn.getAttribute("data-ch")); };
        btn.onclick = go;
      });
    } else if (p === "perk") {
      if (S.optPanel) {
        overlay.classList.add("chance-options");
        overlay.innerHTML = "<div class=\"chance-options-sheet\">" + pauseMarkup() + "</div>";
        bindPauseUi();
        return;
      }
      overlay.classList.remove("chance-options");
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
    if(S.phase==="defense")return;
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
  window.addEventListener("keyup", (e) => {
    if(S.phase!=="defense")return;
    const k=e.key.toLowerCase();
    const h=S.defHeld;if(!h)return;
    if(e.code==="ArrowUp"||k==="w")h.u=0;
    if(e.code==="ArrowDown"||k==="s")h.d=0;
    if(e.code==="ArrowLeft"||k==="a")h.l=0;
    if(e.code==="ArrowRight"||k==="d")h.r=0;
    if(e.code==="Space")h.f=0;
  });
  window.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName ? e.target.tagName : "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || tag === "select" || (e.target && e.target.isContentEditable);
    if (typing) return;
    if (document.querySelector(".modal.open, .modal.show, #modal-auth.open, #auth-modal.open")) return;
    const k = e.key.toLowerCase();
    if(S.phase==="defense"){
      e.preventDefault();
      const h=S.defHeld||(S.defHeld={u:0,d:0,l:0,r:0,f:0});
      if(e.code==="ArrowUp"||k==="w")h.u=1;
      if(e.code==="ArrowDown"||k==="s")h.d=1;
      if(e.code==="ArrowLeft"||k==="a")h.l=1;
      if(e.code==="ArrowRight"||k==="d")h.r=1;
      if(e.code==="Space"){h.f=1;if(!e.repeat&&S.bcDefense)fireTank(S.bcDefense,S.bcDefense.player);}
      return;
    }
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
    if (S.phase === "perk") return !!(S.optPanel && S.optPanel !== "off");
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
    if (S.phase === "defense") return;
    if (S.phase === "chance" || S.phase === "perk") {
      S.optBack = S.phase;
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
  const bcOpen=$("bc-open"),bcClose=$("bc-close"),bcArmy10=$("bc-army10"),bcArmyBar=$("bc-army-bar"),bcDeclare=$("bc-declare"),bcForm=$("bc-form-army");
  if(bcOpen)bcOpen.addEventListener("click",()=>{const p=$("bc-panel");if(p)p.classList.remove("hide");renderBitcoinCountry();});
  if(bcClose)bcClose.addEventListener("click",()=>{const p=$("bc-panel");if(p)p.classList.add("hide");});
  function onBuyArmy(){buyArmy(10);renderBitcoinCountry();renderHud();}
  if(bcArmy10)bcArmy10.addEventListener("click",onBuyArmy);
  if(bcArmyBar)bcArmyBar.addEventListener("click",onBuyArmy);
  if(bcForm)bcForm.addEventListener("click",()=>{formArmy();renderBitcoinCountry();renderHud();});
  if(bcDeclare)bcDeclare.addEventListener("click",()=>{
    if((S.bcNodes||0)<100||S.bcIndependent||S.bcVictory)return;
    const p=$("bc-panel");if(p)p.classList.add("hide");
    window.__arcForce="theQuestion";
    if(S.phase!=="play")S.phase="play";
    dealChance();
    window.__arcForce="";
  });
  (function bindDefensePad(){
    const stick=$("def-stick"), knob=$("def-knob"), fire=$("def-fire");
    if(!stick||!fire)return;
    const fireIds=new Set();
    function held(){return S.defHeld||(S.defHeld={u:0,d:0,l:0,r:0,f:0});}
    function resetStick(){
      S.defStick=null;
      const h=held();h.u=h.d=h.l=h.r=0;
      if(knob)knob.style.transform="translate(0px,0px)";
    }
    function applyStick(cx,cy){
      const r=stick.getBoundingClientRect();
      let dx=cx-(r.left+r.width/2), dy=cy-(r.top+r.height/2);
      const max=r.width*0.32, len=Math.hypot(dx,dy)||1;
      if(len>max){dx*=max/len;dy*=max/len;}
      if(knob)knob.style.transform="translate("+dx+"px,"+dy+"px)";
      const nx=dx/max, ny=dy/max;
      S.defStick={x:nx,y:ny};
      const h=held();h.u=h.d=h.l=h.r=0;
      if(nx*nx+ny*ny<0.08)return;
      if(Math.abs(nx)>Math.abs(ny)) h[nx>0?"r":"l"]=1;
      else h[ny>0?"d":"u"]=1;
    }
    stick.addEventListener("pointerdown",(e)=>{
      e.preventDefault();e.stopPropagation();
      try{stick.setPointerCapture(e.pointerId);}catch(err){}
      applyStick(e.clientX,e.clientY);
    });
    stick.addEventListener("pointermove",(e)=>{
      if(!(e.buttons||e.pointerType==="touch"))return;
      e.preventDefault();applyStick(e.clientX,e.clientY);
    });
    stick.addEventListener("pointerup",resetStick);
    stick.addEventListener("pointercancel",resetStick);
    fire.addEventListener("pointerdown",(e)=>{
      e.preventDefault();e.stopPropagation();
      try{fire.setPointerCapture(e.pointerId);}catch(err){}
      fireIds.add(e.pointerId);
      held().f=1;
      if(S.bcDefense)fireTank(S.bcDefense,S.bcDefense.player);
    });
    function endFire(e){
      fireIds.delete(e.pointerId);
      if(!fireIds.size)held().f=0;
    }
    fire.addEventListener("pointerup",endFire);
    fire.addEventListener("pointercancel",endFire);
  })();
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
