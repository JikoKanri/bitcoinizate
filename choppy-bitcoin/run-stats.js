(() => {
  const GREEN = "#4f9d6e";
  const RED = "#c45c4a";
  function es() { return window.BZ && BZ.lang && BZ.lang() === "es"; }
  function t(en, esTxt) { return es() ? esTxt : en; }
  function fmtTime(sec) {
    const s = Math.max(0, Math.floor(Number(sec) || 0));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function money(n) {
    const x = Number(n) || 0;
    const a = Math.abs(x);
    const sign = x < 0 ? "-" : "";
    if (a >= 1e12) return sign + "$" + (a / 1e12).toFixed(2) + "T";
    if (a >= 1e9) return sign + "$" + (a / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return sign + "$" + (a / 1e6).toFixed(2) + "M";
    if (a >= 1e4) return sign + "$" + (a / 1e3).toFixed(1) + "k";
    return sign + "$" + a.toFixed(a >= 100 ? 0 : 2);
  }
  function fmtBtc(n) {
    const x = Number(n) || 0;
    const a = Math.abs(x);
    if (a >= 1e6) return (x / 1e6).toFixed(2) + "M BTC";
    if (a >= 1000) return (x / 1e3).toFixed(2) + "k BTC";
    if (a >= 1) return x.toFixed(4) + " BTC";
    if (a >= 0.0001) return x.toFixed(6) + " BTC";
    return x.toFixed(8) + " BTC";
  }
  function row(k, v) { return "<li><span class=\"k\">" + k + "</span><span>" + v + "</span></li>"; }

  function statsList(st) {
    if (!st) return "<p>—</p>";
    const startNet = (st.startCash || 0) / Math.max(0.01, st.startPrice || 1);
    const pxMul = (st.endPrice || 0) / Math.max(0.01, st.startPrice || 1);
    const netMul = (st.net || 0) / Math.max(1e-9, startNet);
    return "<ul class=\"recap-list\">"
      + row(t("Time", "Tiempo"), fmtTime(st.time))
      + row(t("Candles", "Velas"), String(st.candles || 0))
      + row(t("Start cash", "Cash inicial"), money(st.startCash))
      + row(t("End cash", "Cash final"), money(st.endCash))
      + row(t("BTC stacked", "BTC apilado"), fmtBtc(st.endBtc))
      + row(t("Start BTC px", "Precio inicial"), money(st.startPrice))
      + row(t("End BTC px", "Precio final"), money(st.endPrice))
      + row(t("Price multiple", "Múltiplo de precio"), pxMul.toFixed(2) + "x")
      + row(t("Peak net", "Pico patrimonio"), fmtBtc(st.peakNet))
      + row(t("Net worth", "Patrimonio"), fmtBtc(st.net))
      + row(t("Stack multiple", "Múltiplo de stack"), netMul.toFixed(2) + "x")
      + row(t("Buys / sells", "Compras / ventas"), (st.buys || 0) + " / " + (st.sells || 0))
      + row(t("Halvings", "Halvings"), (st.halvings || 0) + " · miss " + (st.halveMiss || 0))
      + row(t("Swans vaporized", "Swans vaporizados"), String(st.swans || 0))
      + row(t("Laser eyes", "Ojos láser"), String(st.lasers || 0))
      + row(t("Cold lost", "Cold perdidos"), String(st.coldLost || 0))
      + "</ul>";
  }

  function paintTape(canvas, bag) {
    if (!canvas || !bag) return;
    const data = bag.tape || [];
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(0, 0, W, H);
    if (data.length < 2) {
      ctx.fillStyle = "#8a8680";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("—", W / 2, H / 2);
      return;
    }
    const target = 92;
    const bucket = Math.max(1, Math.ceil(data.length / target));
    const bars = [];
    for (let i = 0; i < data.length; i += bucket) {
      const sl = data.slice(i, i + bucket);
      const o = bars.length ? bars[bars.length - 1].c : sl[0];
      bars.push({ o: o, h: Math.max.apply(null, sl), l: Math.min.apply(null, sl), c: sl[sl.length - 1] });
    }
    let lo = bars[0].l, hi = bars[0].h;
    for (const b of bars) { if (b.l < lo) lo = b.l; if (b.h > hi) hi = b.h; }
    const pad = Math.max(0.01, (hi - lo) * 0.08);
    lo -= pad; hi += pad;
    const left = 8, right = 8, top = 16, bot = 16;
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
    ctx.save();
    ctx.font = "700 8px monospace";
    ctx.textAlign = "center";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(10,10,12,0.82)";
    (bag.marks || []).forEach((mk) => {
      const vi = Math.floor((mk.i || 0) / bucket);
      if (vi < 0 || vi >= bars.length) return;
      const x = left + vi * stepX + cw / 2;
      const peak = mk.kind === "peak";
      const y = py(mk.price) + (peak ? -4 : 4);
      ctx.textBaseline = peak ? "bottom" : "top";
      ctx.fillStyle = peak ? GREEN : RED;
      const lab = money(mk.price);
      ctx.strokeText(lab, x, y);
      ctx.fillText(lab, x, y);
    });
    (bag.trades || []).forEach((tr) => {
      const vi = Math.floor((tr.i || 0) / bucket);
      if (vi < 0 || vi >= bars.length) return;
      const x = left + vi * stepX + cw / 2;
      const y = py(tr.price);
      const buy = tr.kind === "buy";
      ctx.fillStyle = buy ? GREEN : RED;
      ctx.beginPath();
      if (buy) { ctx.moveTo(x, y - 8); ctx.lineTo(x + 5.5, y + 3); ctx.lineTo(x - 5.5, y + 3); }
      else { ctx.moveTo(x, y + 8); ctx.lineTo(x + 5.5, y - 3); ctx.lineTo(x - 5.5, y - 3); }
      ctx.closePath(); ctx.fill();
      ctx.textBaseline = buy ? "bottom" : "top";
      ctx.strokeText(buy ? "B" : "S", x, buy ? y - 9 : y + 9);
      ctx.fillText(buy ? "B" : "S", x, buy ? y - 9 : y + 9);
    });
    ctx.restore();
    ctx.font = "700 9px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = GREEN; ctx.fillText("▲ B", 10, H - 12);
    ctx.fillStyle = RED; ctx.fillText("▼ S", 50, H - 12);
  }

  function ensureModal() {
    let m = document.getElementById("saved-run-modal");
    if (m) return m;
    if (!document.getElementById("saved-run-css")) {
      const css = document.createElement("style");
      css.id = "saved-run-css";
      css.textContent = "#saved-run-modal{position:fixed;inset:0;background:rgba(0,0,0,.72);display:none;align-items:center;justify-content:center;z-index:10000;padding:16px}"
        + "#saved-run-modal.open{display:flex}"
        + "#saved-run-modal .recap-card{background:#0a0a0c;border:1px solid #2a2a2e;max-width:440px;width:100%;max-height:90vh;overflow:auto;padding:16px;color:#f3efe6;font-family:IBM Plex Mono,monospace}"
        + "#saved-run-modal h1{font-size:18px;margin:0 0 10px}"
        + "#saved-run-modal .recap-tabs{display:flex;gap:8px;margin-bottom:10px}"
        + "#saved-run-modal .recap-tabs button{flex:1;min-height:34px;background:#141416;color:#f3efe6;border:1px solid #3a3a40;font:inherit;cursor:pointer}"
        + "#saved-run-modal .recap-tabs button.on{background:#c8960a;color:#09090b;border-color:#f0d060}"
        + "#saved-run-modal .recap-list{list-style:none;padding:8px;margin:0;border:1px solid #2a2a2e}"
        + "#saved-run-modal .recap-list li{display:flex;justify-content:space-between;padding:2px 0;font-size:12px}"
        + "#saved-run-modal .k{color:#8a8680}"
        + "#saved-run-modal #saved-run-tape{width:100%;height:220px;background:#0a0a0c;border:1px solid #2a2a2e}"
        + "#saved-run-modal .recap-close{margin-top:12px;width:100%;min-height:40px;background:#c8960a;color:#09090b;border:0;font:inherit;font-weight:700;cursor:pointer}";
      document.head.appendChild(css);
    }
    m = document.createElement("div");
    m.id = "saved-run-modal";
    m.innerHTML = "<div class=\"recap-card\" id=\"saved-run-card\"></div>";
    document.body.appendChild(m);
    m.addEventListener("click", (e) => { if (e.target === m) closeSavedRunStats(); });
    return m;
  }

  function closeSavedRunStats() {
    const m = document.getElementById("saved-run-modal");
    if (!m) return;
    m.classList.remove("open");
    m.style.display = "none";
  }

  function openSavedRunStats(bag) {
    if (!bag) return;
    const m = ensureModal();
    const card = document.getElementById("saved-run-card");
    let tab = "stats";
    function draw() {
      card.innerHTML = "<h1>" + t("RUN TAPE", "CINTA DE LA RUN") + "</h1>"
        + "<div class=\"recap-tabs\">"
        + "<button type=\"button\" class=\"" + (tab === "stats" ? "on" : "") + "\" data-tab=\"stats\">STATS</button>"
        + "<button type=\"button\" class=\"" + (tab === "chart" ? "on" : "") + "\" data-tab=\"chart\">CHART</button>"
        + "</div>"
        + (tab === "chart" ? "<canvas id=\"saved-run-tape\" width=\"420\" height=\"228\"></canvas>" : statsList(bag))
        + "<button type=\"button\" class=\"recap-close\" id=\"saved-run-close\">" + t("BACK", "VOLVER") + "</button>";
      card.querySelectorAll("[data-tab]").forEach((btn) => {
        btn.onclick = () => { tab = btn.getAttribute("data-tab"); draw(); };
      });
      const close = document.getElementById("saved-run-close");
      if (close) close.onclick = closeSavedRunStats;
      if (tab === "chart") paintTape(document.getElementById("saved-run-tape"), bag);
    }
    draw();
    m.classList.add("open");
    m.style.display = "flex";
  }

  window.openSavedRunStats = openSavedRunStats;
  window.closeSavedRunStats = closeSavedRunStats;
})();
