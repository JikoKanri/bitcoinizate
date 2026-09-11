(() => {
  const $ = (id) => document.getElementById(id);
  const canvas = $("board");
  const ctx = canvas.getContext("2d");
  const COLORS = ["#F2A900", "#3db8ff", "#e05a4f", "#7bd389"];
  const BOTS = ["Nico", "Lena", "Marek"];
  const START = 1400;
  const STAGES = 4;
  const CAP_PRIZE = 2200;

  const CARDS = [
    { id: "turbo", name: "Double hash", nameEs: "Hash doble", text: "Roll two dice this turn.", textEs: "Tirás dos dados este turno." },
    { id: "trap", name: "Bear trap", nameEs: "Trampa oso", text: "Plant a trap here. Next rival who lands pays you 280.", textEs: "Plantá una trampa. El próximo rival que caiga te paga 280." },
    { id: "fork", name: "Reorg", nameEs: "Reorg", text: "Send a rival four steps toward the map edge.", textEs: "Mandá a un rival cuatro pasos hacia el borde." },
    { id: "shove", name: "Push Drago", nameEs: "Empujá a Drago", text: "Dump Dr. Drago onto another player.", textEs: "Pasale Dr. Drago a otro jugador." },
    { id: "tax", name: "Audit", nameEs: "Auditoría", text: "A rival pays you 320 sats.", textEs: "Un rival te paga 320 sats." },
    { id: "hop", name: "Lightning hop", nameEs: "Salto lightning", text: "Jump to a neighboring city.", textEs: "Saltá a una ciudad vecina." },
    { id: "fog", name: "Coinjoin fog", nameEs: "Niebla coinjoin", text: "Drago skips you this round.", textEs: "Drago te saltea esta ronda." },
    { id: "reorg", name: "Hostile take", nameEs: "Toma hostil", text: "Steal a rival's cheapest shop.", textEs: "Robá el negocio más barato de un rival." }
  ];

  const NODES = [
    { id: "salvador", name: "El Salvador", kind: "city", x: 92, y: 318, biz: ["Volcano mine", "Pupusa stand"], cap: true },
    { id: "austin", name: "Austin", kind: "city", x: 128, y: 208, biz: ["Hash barn"] },
    { id: "miami", name: "Miami", kind: "city", x: 178, y: 248, biz: ["Conference", "Yacht club"] },
    { id: "ba", name: "Buenos Aires", kind: "city", x: 178, y: 412, biz: ["Asado stall"] },
    { id: "bA", name: "", kind: "blue", x: 210, y: 300 },
    { id: "rA", name: "", kind: "red", x: 78, y: 168 },
    { id: "yA", name: "", kind: "yellow", x: 214, y: 360 },
    { id: "pAt", name: "", kind: "purple", x: 268, y: 268 },
    { id: "lisbon", name: "Lisbon", kind: "city", x: 338, y: 262, biz: ["Pasteis shop"] },
    { id: "london", name: "London", kind: "city", x: 378, y: 152, biz: ["Pub", "Exchange"] },
    { id: "paris", name: "Paris", kind: "city", x: 418, y: 208, biz: ["Cafe"] },
    { id: "zug", name: "Zug", kind: "city", x: 458, y: 188, biz: ["Valley office"], cap: true },
    { id: "berlin", name: "Berlin", kind: "city", x: 508, y: 158, biz: ["Club"] },
    { id: "prague", name: "Prague", kind: "city", x: 548, y: 188, biz: ["Beer hall"] },
    { id: "rome", name: "Rome", kind: "city", x: 478, y: 272, biz: ["Gelato"] },
    { id: "bE", name: "", kind: "blue", x: 398, y: 308 },
    { id: "rE", name: "", kind: "red", x: 538, y: 238 },
    { id: "yE", name: "", kind: "yellow", x: 348, y: 198 },
    { id: "pE", name: "", kind: "purple", x: 518, y: 308 },
    { id: "lagos", name: "Lagos", kind: "city", x: 428, y: 392, biz: ["Market stall"] },
    { id: "cairo", name: "Cairo", kind: "city", x: 548, y: 328, biz: ["Bazaar"] },
    { id: "dubai", name: "Dubai", kind: "city", x: 628, y: 298, biz: ["Tower suite"], cap: true },
    { id: "rAf", name: "", kind: "red", x: 508, y: 408 },
    { id: "singapore", name: "Singapore", kind: "city", x: 758, y: 368, biz: ["Hawker stall"] },
    { id: "tokyo", name: "Tokyo", kind: "city", x: 848, y: 198, biz: ["Arcade", "Ramen"], cap: true },
    { id: "hk", name: "Hong Kong", kind: "city", x: 788, y: 268, biz: ["Harbor desk"] },
    { id: "bAs", name: "", kind: "blue", x: 698, y: 238 },
    { id: "yAs", name: "", kind: "yellow", x: 728, y: 178 },
    { id: "pAs", name: "", kind: "purple", x: 808, y: 328 }
  ];
  const EDGES = [
    ["salvador", "austin"], ["austin", "miami"], ["miami", "bA"], ["salvador", "yA"], ["yA", "ba"], ["ba", "bA"],
    ["rA", "austin"], ["miami", "pAt"], ["bA", "pAt"], ["pAt", "lisbon"], ["lisbon", "yE"], ["yE", "london"],
    ["lisbon", "bE"], ["london", "paris"], ["paris", "zug"], ["zug", "berlin"], ["berlin", "prague"],
    ["paris", "rome"], ["rome", "bE"], ["rome", "pE"], ["prague", "rE"], ["rE", "pE"], ["bE", "lagos"],
    ["lagos", "rAf"], ["rAf", "cairo"], ["cairo", "dubai"], ["pE", "cairo"], ["zug", "pE"],
    ["dubai", "bAs"], ["bAs", "hk"], ["hk", "tokyo"], ["yAs", "tokyo"], ["bAs", "yAs"], ["hk", "pAs"],
    ["pAs", "singapore"], ["dubai", "singapore"], ["singapore", "hk"]
  ];

  const LAND = [
    [30, 140, 55, 95, 100, 70, 160, 55, 215, 85, 235, 135, 218, 180, 200, 215, 175, 245, 190, 262, 168, 258, 145, 248, 118, 228, 90, 210, 62, 188, 42, 162],
    [90, 210, 118, 228, 145, 248, 158, 275, 142, 302, 118, 328, 96, 338, 78, 318, 76, 278, 82, 242],
    [96, 338, 118, 328, 148, 342, 178, 360, 208, 395, 218, 438, 202, 488, 176, 512, 154, 492, 142, 448, 128, 398, 108, 362],
    [318, 198, 350, 182, 388, 198, 405, 232, 382, 268, 348, 276, 322, 244],
    [330, 145, 368, 108, 430, 92, 502, 96, 556, 118, 572, 158, 548, 188, 518, 176, 488, 198, 452, 212, 418, 216, 388, 198, 352, 182, 334, 162],
    [352, 122, 388, 112, 398, 148, 376, 166, 348, 156],
    [452, 212, 488, 198, 502, 232, 486, 272, 468, 288, 458, 248],
    [388, 252, 452, 242, 522, 258, 572, 282, 588, 342, 572, 402, 532, 458, 468, 482, 418, 462, 392, 398, 382, 328],
    [572, 258, 622, 248, 658, 276, 672, 312, 642, 338, 598, 332, 574, 298],
    [556, 118, 642, 84, 742, 70, 852, 92, 912, 132, 902, 192, 848, 232, 798, 248, 768, 278, 738, 228, 678, 210, 618, 188, 574, 158],
    [828, 168, 862, 152, 882, 176, 872, 214, 844, 222, 824, 198],
    [738, 248, 802, 254, 832, 302, 812, 358, 772, 388, 734, 362, 718, 302],
    [678, 210, 738, 228, 752, 282, 722, 332, 688, 312, 668, 258]
  ];

  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const adj = {};
  NODES.forEach((n) => { adj[n.id] = []; });
  EDGES.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });

  const S = {
    phase: "setup",
    players: [],
    turn: 0,
    stage: 0,
    target: "",
    caps: ["salvador", "zug", "dubai", "tokyo"],
    log: [],
    roll: 0,
    reach: [],
    anim: null,
    traps: {},
    deck: [],
    drago: -1,
    started: false,
    delay: 0,
    delayFn: null,
    diceN: 1,
    diceT: 0,
    diceShow: 1,
    pulse: 0
  };

  function es() {
    try {
      const l = localStorage.getItem("bitcoinizate-lang");
      if (l === "es" || l === "en") return l === "es";
    } catch (e) {}
    return String(navigator.language || "").toLowerCase().indexOf("es") === 0;
  }
  const ES = es();
  document.documentElement.lang = ES ? "es" : "en";
  function t(en, esx) { return ES && esx ? esx : en; }

  function log(msg) {
    S.log.unshift(msg);
    S.log = S.log.slice(0, 36);
    $("log").innerHTML = S.log.map((l) => "<div>" + l + "</div>").join("");
  }
  function cur() { return S.players[S.turn]; }
  function nodeOf(p) { return byId[p.at]; }
  function net(p) {
    let n = p.cash;
    p.shops.forEach((s) => { n += s.cost; });
    return n;
  }
  function lastPlace() {
    return S.players.slice().sort((a, b) => net(a) - net(b))[0];
  }
  function later(sec, fn) {
    S.delay = sec;
    S.delayFn = fn;
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const x = a[i]; a[i] = a[j]; a[j] = x;
    }
    return a;
  }
  function makeDeck() {
    const d = [];
    CARDS.forEach((c) => { d.push(c.id, c.id, c.id); });
    return shuffle(d);
  }
  function drawCard() {
    if (!S.deck.length) S.deck = makeDeck();
    return S.deck.pop();
  }
  function cardInfo(id) { return CARDS.find((c) => c.id === id) || CARDS[0]; }
  function cardName(id) {
    const c = cardInfo(id);
    return ES ? c.nameEs : c.name;
  }
  function cardText(id) {
    const c = cardInfo(id);
    return ES ? c.textEs : c.text;
  }
  function allShops() {
    const out = [];
    S.players.forEach((p) => p.shops.forEach((s) => out.push(Object.assign({ owner: p.id }, s))));
    return out;
  }
  function humanTurn() {
    const p = cur();
    return S.started && p && !p.ai && (S.phase === "play" || S.phase === "pick" || S.phase === "shop" || S.phase === "rival");
  }

  function humanTurn() {
    const p = cur();
    return S.started && p && !p.ai && (S.phase === "play" || S.phase === "pick" || S.phase === "shop" || S.phase === "rival");
  }

  function startGame(humans, bots) {
    const n = Math.max(2, Math.min(4, (humans | 0) + (bots | 0)));
    S.players = [];
    let botI = 0;
    for (let i = 0; i < n; i++) {
      const isHuman = i < humans;
      S.players.push({
        id: i,
        name: i === 0 ? t("You", "Vos") : (isHuman ? t("P" + (i + 1), "J" + (i + 1)) : BOTS[botI++]),
        ai: !isHuman,
        cash: START,
        at: "lisbon",
        cards: [drawCard()],
        shops: [],
        color: COLORS[i],
        skipDrago: false
      });
    }
    S.turn = 0;
    S.stage = 0;
    S.caps = ["salvador", "zug", "dubai", "tokyo"];
    S.target = S.caps[0];
    S.traps = {};
    S.drago = -1;
    S.deck = makeDeck();
    S.phase = "play";
    S.started = true;
    S.anim = null;
    S.reach = [];
    S.roll = 0;
    log(t("Stage 1. First to " + byId[S.target].name + " banks the prize.", "Etapa 1. El primero en " + byId[S.target].name + " se lleva el premio."));
    beginTurn();
  }

  function beginTurn() {
    if (S.phase === "win") return;
    const p = cur();
    S.phase = "play";
    S.roll = 0;
    S.reach = [];
    collectRent(p);
    paint();
    if (p.ai) later(0.45, aiTurn);
    else showTurn();
  }

  function collectRent(p) {
    let got = 0;
    const byCity = {};
    p.shops.forEach((s) => { byCity[s.city] = (byCity[s.city] || 0) + 1; });
    Object.keys(byCity).forEach((cid) => {
      const all = (byId[cid].biz || []).length;
      const own = byCity[cid];
      got += own * (own === all && all > 1 ? 90 : 50);
    });
    if (got) {
      p.cash += got;
      log(p.name + " " + t("collects", "cobra") + " " + got);
    }
  }

  function showTurn() {
    const p = cur();
    const tgt = byId[S.target].name;
    let html = "<h2>" + p.name + "</h2>";
    html += "<p>" + t("Target", "Meta") + ": <b>" + tgt + "</b> · " + t("Stage", "Etapa") + " " + (S.stage + 1) + "/" + STAGES;
    html += "<br>" + t("Cash", "Caja") + " " + p.cash + " · " + t("Net", "Neto") + " " + net(p) + "</p>";
    if (S.drago === p.id) html += "<p>" + t("Dr. Drago is on you. Dump him with a card or by landing on someone.", "Dr. Drago va con vos. Tiraló con una carta o cayendo sobre alguien.") + "</p>";
    html += "<div class='row'>";
    p.cards.forEach((id, i) => {
      html += "<button class='card' data-card='" + i + "'><b>" + cardName(id) + "</b>" + cardText(id) + "</button>";
    });
    html += "<button id='roll'>" + t("Roll", "Tirar") + "</button></div>";
    html += "<p class='hint'>" + t("Play a card or roll. Then tap a highlighted node exactly that far away.", "Jugá una carta o tirás. Después tocá un nodo iluminado a esa distancia exacta.") + "</p>";
    showPanel(html);
    $("roll").onclick = () => doRoll(1);
    panel().querySelectorAll("[data-card]").forEach((btn) => {
      btn.onclick = () => playCard(p, Number(btn.getAttribute("data-card")));
    });
  }

  function panel() { return $("panel"); }
  function showPanel(html) { panel().classList.remove("hide"); panel().innerHTML = html; }
  function hidePanel() { panel().classList.add("hide"); panel().innerHTML = ""; }

  function doRoll(n) {
    hidePanel();
    S.phase = "dice";
    S.diceN = n;
    S.diceT = 0;
    S.diceShow = 1 + ((Math.random() * 6) | 0);
  }

  function settleRoll() {
    let tot = 0;
    const faces = [];
    for (let i = 0; i < S.diceN; i++) {
      const f = 1 + ((Math.random() * 6) | 0);
      faces.push(f);
      tot += f;
    }
    S.roll = tot;
    S.diceShow = tot;
    log(cur().name + " " + t("rolls", "saca") + " " + (faces.length > 1 ? faces.join("+") + "=" : "") + tot);
    S.reach = reachable(cur().at, tot);
    S.phase = "pick";
    paint();
    if (!S.reach.length) {
      log(t("Nowhere to go.", "No hay camino."));
      endTurn();
      return;
    }
    if (cur().ai) later(0.38, () => pickNode(aiPick()));
    else {
      showPanel("<h2><span class='die'>" + tot + "</span>" + t("Move", "Mover") + "</h2><p>" + t("Tap a lit node that far away. You pick the route.", "Tocá un nodo a esa distancia. Vos elegís la ruta.") + "</p>");
    }
  }

  function reachable(start, steps) {
    const out = [];
    const q = [[start, steps, [start]]];
    const seen = {};
    while (q.length) {
      const [id, left, path] = q.shift();
      if (left === 0) {
        if (id !== start) out.push({ id, path });
        continue;
      }
      adj[id].forEach((n) => {
        const key = n + ":" + (left - 1);
        if (seen[key]) return;
        seen[key] = 1;
        q.push([n, left - 1, path.concat(n)]);
      });
    }
    const best = {};
    out.forEach((o) => {
      if (!best[o.id] || o.path.length < best[o.id].path.length) best[o.id] = o;
    });
    return Object.values(best);
  }

  function dist(a, b) {
    const q = [[a, 0]];
    const seen = { [a]: 1 };
    while (q.length) {
      const [id, d] = q.shift();
      if (id === b) return d;
      adj[id].forEach((n) => {
        if (seen[n]) return;
        seen[n] = 1;
        q.push([n, d + 1]);
      });
    }
    return 99;
  }

  function aiPick() {
    const tgt = S.target;
    let best = S.reach[0];
    let score = -1e9;
    const p = cur();
    S.reach.forEach((r) => {
      let s = -dist(r.id, tgt) * 4;
      const nd = byId[r.id];
      if (r.id === tgt) s += 120;
      if (nd.kind === "city") {
        s += 8;
        const left = (nd.biz || []).filter((name) => !allShops().some((x) => x.city === nd.id && x.name === name));
        if (left.length && p.cash >= 420) s += 10;
        const tax = landingRentValue(p, nd);
        s -= tax / 40;
      }
      if (nd.kind === "blue") s += 5;
      if (nd.kind === "yellow") s += 6;
      if (nd.kind === "purple" && p.cards.length < 3) s += 4;
      if (nd.kind === "red") s -= 8;
      if (S.traps[r.id] != null && S.traps[r.id] !== p.id) s -= 12;
      S.players.forEach((o) => {
        if (o.id !== p.id && o.at === r.id) {
          if (S.drago === p.id) s += 18;
          if (S.drago === o.id) s -= 14;
        }
      });
      if (s > score) { score = s; best = r; }
    });
    return best.id;
  }

  function pickNode(id) {
    if (S.phase !== "pick") return;
    const hit = S.reach.find((r) => r.id === id);
    if (!hit) return;
    S.phase = "anim";
    S.anim = { from: cur().at, seq: hit.path.slice(1), i: 0, t: 0 };
    hidePanel();
    paint();
  }

  function pawnPos(p) {
    if (S.anim && cur() === p && S.anim.seq[S.anim.i]) {
      const fromId = S.anim.i === 0 ? S.anim.from : S.anim.seq[S.anim.i - 1];
      const toId = S.anim.seq[S.anim.i];
      const A = byId[fromId]; const B = byId[toId];
      const u = Math.min(1, S.anim.t / 0.26);
      const e = u * u * (3 - 2 * u);
      return { x: A.x + (B.x - A.x) * e, y: A.y + (B.y - A.y) * e };
    }
    const n = byId[p.at];
    return { x: n.x, y: n.y };
  }

  function finishMove() {
    const p = cur();
    const nd = nodeOf(p);
    S.anim = null;
    S.reach = [];
    S.players.forEach((o) => {
      if (o.id === p.id || o.at !== p.at) return;
      if (S.drago === p.id) {
        S.drago = o.id;
        log(t("Drago hops to ", "Drago salta a ") + o.name);
      } else if (S.drago === o.id) {
        S.drago = p.id;
        log(t("Drago sticks to ", "Drago se pega a ") + p.name);
      }
    });
    if (S.traps[p.at] != null && S.traps[p.at] !== p.id) {
      const owner = S.players[S.traps[p.at]];
      const tax = Math.min(280, p.cash);
      p.cash -= tax;
      if (owner) owner.cash += tax;
      delete S.traps[p.at];
      log(t("Trap snaps. ", "Trampa. ") + p.name + " −" + tax);
    }
    if (p.at === S.target) {
      p.cash += CAP_PRIZE;
      log(p.name + " " + t("hits the capital. +" + CAP_PRIZE, "llega a la capital. +" + CAP_PRIZE));
      nextStage();
      return;
    }
    resolveTile(p, nd);
  }

  function landingRentValue(p, nd) {
    if (nd.kind !== "city") return 0;
    let total = 0;
    const byOwner = {};
    allShops().forEach((s) => {
      if (s.city !== nd.id || s.owner === p.id) return;
      byOwner[s.owner] = (byOwner[s.owner] || 0) + 1;
    });
    const biz = (nd.biz || []).length;
    Object.keys(byOwner).forEach((oid) => {
      const n = byOwner[oid];
      total += n * (n === biz && biz > 1 ? 260 : 130);
    });
    return total;
  }

  function payLanding(p, nd) {
    if (nd.kind !== "city") return;
    const byOwner = {};
    allShops().forEach((s) => {
      if (s.city !== nd.id || s.owner === p.id) return;
      byOwner[s.owner] = (byOwner[s.owner] || 0) + 1;
    });
    const biz = (nd.biz || []).length;
    Object.keys(byOwner).forEach((oid) => {
      const owner = S.players[Number(oid)];
      const n = byOwner[oid];
      const rent = n * (n === biz && biz > 1 ? 260 : 130);
      const pay = Math.min(rent, p.cash);
      p.cash -= pay;
      owner.cash += pay;
      if (pay) log(p.name + " " + t("pays rent", "paga renta") + " " + pay + " → " + owner.name + " @ " + nd.name);
    });
  }

  function resolveTile(p, nd) {
    payLanding(p, nd);
    if (nd.kind === "blue") {
      p.cash += 180;
      log(p.name + " +180");
      afterResolve();
    } else if (nd.kind === "red") {
      const loss = Math.min(150, p.cash);
      p.cash -= loss;
      log(p.name + " −" + loss);
      afterResolve();
    } else if (nd.kind === "yellow") {
      const id = drawCard();
      p.cards.push(id);
      log(p.name + " " + t("draws", "roba") + " " + cardName(id));
      afterResolve();
    } else if (nd.kind === "purple") {
      if (p.ai) { aiShop(p); afterResolve(); }
      else openShop(p);
    } else if (nd.kind === "city") {
      if (p.ai) { aiBuy(p, nd); afterResolve(); }
      else openCity(p, nd);
    } else afterResolve();
  }

  function openShop(p) {
    S.phase = "shop";
    let html = "<h2>" + t("Card desk", "Mesa de cartas") + "</h2><p>" + t("Buy a card for 200 or sell one for 100.", "Comprá una carta por 200 o vendé una por 100.") + "</p><div class='row'>";
    html += "<button id='buy-c'" + (p.cash < 200 ? " disabled" : "") + ">" + t("Buy card", "Comprar carta") + "</button>";
    p.cards.forEach((id, i) => {
      html += "<button class='alt' data-sell='" + i + "'>" + t("Sell", "Vender") + " " + cardName(id) + "</button>";
    });
    html += "<button class='alt' id='skip'>" + t("Skip", "Seguir") + "</button></div>";
    showPanel(html);
    if ($("buy-c")) $("buy-c").onclick = () => {
      p.cash -= 200;
      p.cards.push(drawCard());
      log(p.name + " " + t("buys a card", "compra una carta"));
      afterResolve();
    };
    panel().querySelectorAll("[data-sell]").forEach((b) => {
      b.onclick = () => {
        const i = Number(b.getAttribute("data-sell"));
        p.cards.splice(i, 1);
        p.cash += 100;
        afterResolve();
      };
    });
    $("skip").onclick = afterResolve;
  }

  function openCity(p, nd) {
    const ownedHere = allShops().filter((s) => s.city === nd.id);
    const left = (nd.biz || []).filter((name) => !ownedHere.some((s) => s.name === name));
    S.phase = "shop";
    let html = "<h2>" + nd.name + "</h2>";
    if (!left.length) html += "<p>" + t("All shops taken. Owners still collect rent.", "No quedan negocios. Los dueños siguen cobrando renta.") + "</p>";
    else html += "<p>" + t("Buy a shop. Own the whole city for double rent.", "Comprá un negocio. El monopolio de la ciudad dobla la renta.") + "</p>";
    html += "<div class='row'>";
    left.forEach((name, i) => {
      const cost = 420 + i * 180;
      html += "<button data-buy='" + i + "'" + (p.cash < cost ? " disabled" : "") + ">" + name + " · " + cost + "</button>";
    });
    html += "<button class='alt' id='skip'>" + t("Leave", "Salir") + "</button></div>";
    showPanel(html);
    panel().querySelectorAll("[data-buy]").forEach((b) => {
      b.onclick = () => {
        const i = Number(b.getAttribute("data-buy"));
        const name = left[i];
        const cost = 420 + i * 180;
        p.cash -= cost;
        p.shops.push({ city: nd.id, name, cost });
        log(p.name + " " + t("buys", "compra") + " " + name + " @ " + nd.name);
        afterResolve();
      };
    });
    $("skip").onclick = afterResolve;
  }

  function aiShop(p) {
    if (p.cash >= 200 && p.cards.length < 3) {
      p.cash -= 200;
      p.cards.push(drawCard());
      log(p.name + " " + t("buys a card", "compra una carta"));
    } else if (p.cards.length > 3) {
      p.cards.pop();
      p.cash += 100;
    }
  }
  function aiBuy(p, nd) {
    const ownedHere = allShops().filter((s) => s.city === nd.id);
    const left = (nd.biz || []).filter((name) => !ownedHere.some((s) => s.name === name));
    if (!left.length) return;
    const cost = 420;
    if (p.cash >= cost + 180) {
      p.cash -= cost;
      p.shops.push({ city: nd.id, name: left[0], cost });
      log(p.name + " " + t("buys", "compra") + " " + left[0] + " @ " + nd.name);
    }
  }

  function playCard(p, idx) {
    const id = p.cards[idx];
    if (!id) return;
    if (S.phase !== "play" && S.phase !== "rival") return;
    p.cards.splice(idx, 1);
    log(p.name + " → " + cardName(id));
    if (id === "turbo") { hidePanel(); doRoll(2); return; }
    if (id === "trap") {
      S.traps[p.at] = p.id;
      log(t("Trap armed.", "Trampa armada."));
      if (!p.ai) showTurn();
      return;
    }
    if (id === "fog") {
      p.skipDrago = true;
      if (!p.ai) showTurn();
      return;
    }
    if (id === "hop") {
      const cities = adj[p.at].filter((n) => byId[n].kind === "city");
      const opts = cities.length ? cities : adj[p.at];
      if (p.ai) opts.sort((a, b) => dist(a, S.target) - dist(b, S.target));
      S.phase = "pick";
      S.reach = opts.map((oid) => ({ id: oid, path: [p.at, oid] }));
      if (p.ai) {
        later(0.2, () => pickNode(opts[0]));
        return;
      }
      showPanel("<p>" + t("Tap a neighboring city.", "Tocá una ciudad vecina.") + "</p>");
      paint();
      return;
    }
    if (id === "shove" || id === "tax" || id === "fork" || id === "reorg") {
      pickRival(p, id);
      return;
    }
    if (!p.ai) showTurn();
  }

  function bestRival(p, kind) {
    const others = S.players.filter((o) => o.id !== p.id);
    if (kind === "reorg") return others.slice().sort((a, b) => b.shops.length - a.shops.length)[0];
    if (kind === "tax" || kind === "fork" || kind === "shove") return others.slice().sort((a, b) => net(b) - net(a))[0];
    return others[0];
  }

  function pickRival(p, kind) {
    const others = S.players.filter((o) => o.id !== p.id);
    if (p.ai) { applyRival(p, bestRival(p, kind), kind); return; }
    S.phase = "rival";
    let html = "<h2>" + cardName(kind) + "</h2><div class='row'>";
    others.forEach((o) => {
      html += "<button data-riv='" + o.id + "'>" + o.name + "</button>";
    });
    html += "</div>";
    showPanel(html);
    panel().querySelectorAll("[data-riv]").forEach((b) => {
      b.onclick = () => {
        applyRival(p, S.players[Number(b.getAttribute("data-riv"))], kind);
        S.phase = "play";
        showTurn();
      };
    });
  }

  function applyRival(p, o, kind) {
    if (!o) return;
    if (kind === "shove") {
      if (S.drago === p.id) { S.drago = o.id; log(t("Drago dumped on ", "Drago a ") + o.name); }
      else log(t("Drago was not on you.", "Drago no estaba con vos."));
    } else if (kind === "tax") {
      const x = Math.min(320, o.cash);
      o.cash -= x; p.cash += x;
      log(o.name + " " + t("audited −", "auditoría −") + x);
    } else if (kind === "fork") {
      const edge = NODES[0];
      const path = reachable(o.at, 4);
      const best = path.slice().sort((a, b) => dist(a.id, edge.id) - dist(b.id, edge.id))[0];
      if (best) o.at = best.id;
      log(o.name + " " + t("is forked to ", "queda en ") + (byId[o.at].name || o.at));
    } else if (kind === "reorg") {
      if (!o.shops.length) { log(t("Nothing to take.", "Nada que tomar.")); return; }
      o.shops.sort((a, b) => a.cost - b.cost);
      const s = o.shops.shift();
      p.shops.push(s);
      log(p.name + " " + t("takes", "toma") + " " + s.name);
    }
  }

  function afterResolve() {
    hidePanel();
    dragoTick();
    endTurn();
  }

  function dragoTick() {
    if (S.stage < 1 || S.drago < 0) return;
    const p = S.players[S.drago];
    if (!p || p.skipDrago) { if (p) p.skipDrago = false; return; }
    const act = (Math.random() * 3) | 0;
    if (act === 0 || (!p.cards.length && !p.shops.length)) {
      const x = Math.min(180, p.cash);
      p.cash -= x;
      log("Drago " + t("skims", "sisa") + " " + x + " @ " + p.name);
    } else if (act === 1 && p.cards.length) {
      p.cards.pop();
      log("Drago " + t("rips a card from ", "rompe una carta de ") + p.name);
    } else if (p.shops.length) {
      const s = p.shops.pop();
      log("Drago " + t("firesale", "remata") + " " + s.name);
      p.cash += Math.floor(s.cost * 0.4);
    }
  }

  function nextStage() {
    S.stage += 1;
    if (S.stage >= STAGES) { finish(); return; }
    S.target = S.caps[S.stage];
    S.drago = lastPlace().id;
    log(t("Stage ", "Etapa ") + (S.stage + 1) + ": " + byId[S.target].name + ". Drago → " + S.players[S.drago].name);
    endTurn();
  }

  function finish() {
    S.phase = "win";
    S.started = true;
    const ranked = S.players.slice().sort((a, b) => net(b) - net(a));
    const win = ranked[0];
    let html = "<h2>" + t("Richest stack", "El stack más gordo") + "</h2><p>" + win.name + " · " + net(win) + "</p>";
    html += ranked.map((p, i) => (i + 1) + ". " + p.name + " · " + net(p)).join("<br>");
    html += "<div class='row' style='margin-top:10px'><button id='again'>" + t("Play again", "Otra vez") + "</button><a href='/'><button class='alt'>" + t("Home", "Inicio") + "</button></a></div>";
    showPanel(html);
    $("again").onclick = () => setup();
    paint();
  }

  function endTurn() {
    if (S.phase === "win") return;
    S.phase = "play";
    S.turn = (S.turn + 1) % S.players.length;
    later(0.32, beginTurn);
  }

  function aiTurn() {
    const p = cur();
    if (!p || !p.ai || S.phase !== "play") return;
    const has = (id) => p.cards.indexOf(id);
    const play = (id) => {
      const i = has(id);
      if (i < 0) return false;
      playCard(p, i);
      return true;
    };
    if (S.drago === p.id && play("shove")) {
      later(0.35, () => { if (cur() === p && S.phase === "play") doRoll(1); });
      return;
    }
    if (S.drago === p.id) play("fog");
    const lead = S.players.slice().sort((a, b) => net(b) - net(a))[0];
    if (lead.id !== p.id && lead.shops.length && net(p) < net(lead) * 0.75) play("reorg");
    if (lead.id !== p.id && lead.cash > 400) play("tax");
    if (dist(p.at, S.target) > 6 && play("turbo")) return;
    if (dist(p.at, S.target) > 4 && play("hop")) return;
    if (has("trap") >= 0 && byId[p.at].kind === "city") play("trap");
    doRoll(1);
  }

  function setup() {
    S.phase = "setup";
    S.started = false;
    S.players = [];
    S.drago = -1;
    S.reach = [];
    S.anim = null;
    $("tag").textContent = t("World rally · play money", "Rally mundial · play money");
    $("legend").innerHTML = [
      ["#F2A900", t("Capital", "Capital")],
      ["#2f8f6b", t("Sats", "Sats")],
      ["#a33a32", t("Loss", "Pérdida")],
      ["#d4b03a", t("Card", "Carta")],
      ["#7a5ea8", t("Card desk", "Mesa")],
      ["#c4c0b8", t("City / shops", "Ciudad")]
    ].map(([c, l]) => "<span class='lg'><i style='background:" + c + "'></i>" + l + "</span>").join("");
    showPanel(
      "<h2>Madcap Hash</h2><p>" + t(
        "Race four bitcoin capitals on a world board. Buy shops, collect rent, plant traps, and dump Dr. Drago on a rival. After Tokyo, the fattest stack wins. Play money.",
        "Corré cuatro capitales bitcoin en un tablero mundial. Comprá negocios, cobrá renta, plantá trampas y pasale Dr. Drago a un rival. Después de Tokio, gana el stack más gordo. Dinero de juguete."
      ) + "</p><div class='row'>" +
      "<button id='go1'>" + t("You + 2 bots", "Vos + 2 bots") + "</button>" +
      "<button class='alt' id='go2'>" + t("You + 3 bots", "Vos + 3 bots") + "</button>" +
      "<button class='alt' id='go3'>" + t("2 players", "2 jugadores") + "</button>" +
      "<button class='alt' id='go4'>" + t("3 players", "3 jugadores") + "</button>" +
      "</div><p class='hint'>" + t("Same device for 2–3 players. Dice is exact: pick any lit city that many steps away.", "Mismo dispositivo para 2–3. El dado es exacto: elegí cualquier ciudad iluminada a esos pasos.") + "</p>"
    );
    $("go1").onclick = () => startGame(1, 2);
    $("go2").onclick = () => startGame(1, 3);
    $("go3").onclick = () => startGame(2, 0);
    $("go4").onclick = () => startGame(3, 0);
    paint();
  }

  function colorOf(kind) {
    if (kind === "blue") return "#2f8f6b";
    if (kind === "red") return "#a33a32";
    if (kind === "yellow") return "#d4b03a";
    if (kind === "purple") return "#7a5ea8";
    if (kind === "city") return "#c4c0b8";
    return "#888";
  }

  let lastW = 0;
  function layout() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(320, r.width);
    const h = w * (540 / 960);
    if (w !== lastW || canvas.width !== Math.round(w * dpr)) {
      lastW = w;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + "px";
    }
    ctx.setTransform(dpr * w / 960, 0, 0, dpr * h / 540, 0, 0);
  }

  function fillPoly(pts, fill) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function paint() {
    layout();
    ctx.clearRect(0, 0, 960, 540);
    ctx.fillStyle = "#0b1520";
    ctx.fillRect(0, 0, 960, 540);
    ctx.strokeStyle = "rgba(242,169,0,0.06)";
    ctx.lineWidth = 1;
    for (let x = 40; x < 960; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, 520); ctx.stroke();
    }
    for (let y = 40; y < 540; y += 60) {
      ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(940, y); ctx.stroke();
    }
    ctx.setLineDash([4, 10]);
    ctx.strokeStyle = "rgba(243,239,230,0.12)";
    ctx.beginPath(); ctx.moveTo(20, 300); ctx.lineTo(940, 300); ctx.stroke();
    ctx.setLineDash([]);
    LAND.forEach((p) => fillPoly(p, "#1b3344"));
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(242,169,0,0.22)";
    LAND.forEach((pts) => {
      ctx.beginPath();
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath();
      ctx.stroke();
    });
    ctx.strokeStyle = "rgba(242,169,0,0.4)";
    ctx.lineWidth = 2.2;
    EDGES.forEach(([a, b]) => {
      const A = byId[a], B = byId[b];
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    });
    const reachIds = {};
    S.reach.forEach((r) => { reachIds[r.id] = 1; });
    const pulse = 0.55 + Math.sin(S.pulse * 4) * 0.45;
    NODES.forEach((n) => {
      const r = n.kind === "city" ? 11 : 7.5;
      if (n.id === S.target && S.started) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 16 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(242,169,0," + (0.35 + pulse * 0.25) + ")";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      if (reachIds[n.id]) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 5 + pulse * 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,246,208," + (0.5 + pulse * 0.4) + ")";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.id === S.target && S.started ? "#F2A900" : colorOf(n.kind);
      ctx.fill();
      ctx.strokeStyle = "#0a0a0c";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (S.traps[n.id] != null) {
        ctx.fillStyle = "#e05a4f";
        ctx.beginPath();
        ctx.moveTo(n.x, n.y - 18);
        ctx.lineTo(n.x + 5, n.y - 10);
        ctx.lineTo(n.x - 5, n.y - 10);
        ctx.closePath();
        ctx.fill();
      }
      const shops = allShops().filter((s) => s.city === n.id);
      shops.forEach((s, i) => {
        const owner = S.players[s.owner];
        if (!owner) return;
        const ang = -Math.PI / 2 + i * 0.7;
        ctx.fillStyle = owner.color;
        ctx.fillRect(n.x + Math.cos(ang) * 16 - 3, n.y + Math.sin(ang) * 16 - 3, 6, 6);
      });
      if (n.kind === "city") {
        ctx.font = "10px IBM Plex Mono, monospace";
        ctx.textAlign = "center";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(10,16,22,0.85)";
        ctx.strokeText(n.name, n.x, n.y - 16);
        ctx.fillStyle = n.id === S.target && S.started ? "#F2A900" : "#f3efe6";
        ctx.fillText(n.name, n.x, n.y - 16);
      }
    });
    S.players.forEach((p, i) => {
      const pos = pawnPos(p);
      const ox = (i % 2) * 10 - 5;
      const oy = (i < 2 ? -7 : 7);
      const x = pos.x + ox;
      const y = pos.y + oy;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = S.turn === i && S.phase !== "setup" ? "#fff" : "#0a0a0c";
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.fillStyle = "#120c02";
      ctx.font = "bold 9px IBM Plex Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText(p.name.charAt(0), x, y + 3);
      if (S.drago === i) {
        ctx.fillStyle = "#111";
        ctx.fillRect(x - 5, y - 16, 10, 6);
        ctx.fillRect(x - 3, y - 20, 6, 4);
      }
    });
    if (S.phase === "dice") {
      ctx.fillStyle = "rgba(10,10,12,0.35)";
      ctx.fillRect(0, 0, 960, 540);
      const val = S.diceShow;
      ctx.fillStyle = "#f3efe6";
      roundRect(430, 210, 100, 100, 10);
      ctx.fill();
      ctx.fillStyle = "#120c02";
      ctx.font = "bold 48px IBM Plex Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(val), 480, 275);
    }
    hud();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function hud() {
    const tgt = S.target && byId[S.target] ? byId[S.target].name : "—";
    $("hud-meta").textContent = S.started
      ? t("Stage", "Etapa") + " " + (S.stage + 1) + "/" + STAGES + " · " + tgt
      : t("World rally", "Rally mundial");
    $("hud-players").innerHTML = S.players.map((p, i) => {
      return "<div class='p-row" + (i === S.turn && S.started && S.phase !== "setup" ? " on" : "") + "'><span><span class='dot' style='background:" + p.color + "'></span>" + p.name + (S.drago === i ? " · Drago" : "") + "<small>" + t("Cash", "Caja") + " " + p.cash + " · " + t("Shops", "Negocios") + " " + p.shops.length + "</small></span><b>" + net(p) + "</b></div>";
    }).join("");
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (S.phase !== "pick") return;
    if (cur() && cur().ai) return;
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (960 / r.width);
    const y = (e.clientY - r.top) * (540 / r.height);
    let best = null, bd = 22;
    S.reach.forEach((o) => {
      const n = byId[o.id];
      const d = Math.hypot(n.x - x, n.y - y);
      if (d < bd) { bd = d; best = o.id; }
    });
    if (best) pickNode(best);
  });

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    S.pulse += dt;
    if (S.delay > 0) {
      S.delay -= dt;
      if (S.delay <= 0) {
        const fn = S.delayFn;
        S.delayFn = null;
        if (fn) fn();
      }
    }
    if (S.phase === "dice") {
      S.diceT += dt;
      S.diceShow = 1 + ((Math.random() * 6) | 0);
      if (S.diceT > 0.55) settleRoll();
    }
    if (S.anim) {
      S.anim.t += dt;
      if (S.anim.t > 0.26) {
        S.anim.t = 0;
        const id = S.anim.seq[S.anim.i];
        if (id) cur().at = id;
        S.anim.i += 1;
        if (S.anim.i >= S.anim.seq.length) finishMove();
      }
    }
    paint();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", paint);
  setup();
  requestAnimationFrame(loop);
})();
