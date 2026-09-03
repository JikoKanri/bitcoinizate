(() => {
  const canvas = document.getElementById("c");
  const field = document.getElementById("field");
  const overlay = document.getElementById("overlay");
  const A = window.ArcadeAudio;
  const POWER_S = 6;
  const HALVE_N = 21;
  const GREEN = "#4f9d6e";
  const RED = "#c45c4a";
  const BTC = "#c8960a";
  const KEY = "bitcoinizate-v1";
  const $ = (id) => document.getElementById(id);
  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const fmtBtc = (n) => (n >= 1e6 ? (n / 1e6).toFixed(2) + "M BTC" : n >= 100 ? n.toFixed(2) + " BTC" : n.toFixed(5) + " BTC");
  const fmtVt = (n) => (n >= 1000 ? n.toFixed(1) : n.toFixed(3)) + " VT";
  const fmtTime = (t) => { const s = Math.max(0, Math.floor(t)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  window.__CHOPPY_PENDING = true;
})();
