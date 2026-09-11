(() => {
  const DB_URL = "https://xhewdrhfofwpzfogthai.supabase.co";
  const DB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXdkcmhmb2Z3cHpmb2d0aGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDM0OTMsImV4cCI6MjEwMjk3OTQ5M30.zch7bpyq2kaYaQeW4wMrQhkSPxyzzKKiD6jRLTWYidY";
  const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  function rid(n) {
    let s = "";
    for (let i = 0; i < (n || 8); i++) s += ABC[(Math.random() * ABC.length) | 0];
    return s;
  }
  function myName() {
    try {
      const tag = document.getElementById("user-profile-tag");
      const t = tag && !tag.classList.contains("hide") ? (tag.textContent || "") : "";
      const n = String(t).replace(/^@/, "").trim();
      if (n) return n.slice(0, 16);
    } catch (e) {}
    return "P-" + rid(4);
  }

  const MP = {
    id: rid(8),
    name: "P",
    code: "",
    host: false,
    seed: 0,
    started: false,
    players: [],
    ws: null,
    joinRef: "1",
    refN: 1,
    beat: 0,
    hb: 0,
    on: null
  };

  function emit(ev, data) {
    if (typeof MP.on === "function") try { MP.on(ev, data); } catch (e) {}
  }
  function topic() { return "realtime:mp-" + MP.code; }
  function push(msg) {
    if (!MP.ws || MP.ws.readyState !== 1) return;
    msg.ref = String(++MP.refN);
    if (!msg.join_ref) msg.join_ref = MP.joinRef;
    try { MP.ws.send(JSON.stringify(msg)); } catch (e) {}
  }
  function send(event, payload) {
    if (!MP.code) return;
    push({
      topic: topic(),
      event: "broadcast",
      payload: { type: "broadcast", event: event, payload: payload || {} }
    });
  }

  function upsert(p) {
    if (!p || !p.id) return;
    const i = MP.players.findIndex((x) => x.id === p.id);
    if (i < 0) MP.players.push(Object.assign({ alive: true, candles: 0, lifeT: 0, last: Date.now() }, p));
    else MP.players[i] = Object.assign({}, MP.players[i], p, { last: Date.now() });
  }
  function me() {
    return { id: MP.id, name: MP.name, host: MP.host, alive: true };
  }
  function aliveList() { return MP.players.filter((p) => p.alive !== false); }
  function considerOver() {
    if (!MP.started) return;
    const live = aliveList();
    if (MP.players.length < 2) return;
    if (live.length === 1) emit("over", { winner: live[0] });
    else if (live.length === 0) {
      const best = MP.players.slice().sort((a, b) => (b.lifeT || 0) - (a.lifeT || 0))[0];
      if (best) emit("over", { winner: best });
    }
  }

  function onMsg(raw) {
    let m;
    try { m = JSON.parse(raw); } catch (e) { return; }
    if (!m) return;
    if (m.event === "phx_reply" && m.payload && m.payload.status === "error") {
      emit("err", (m.payload.response && m.payload.response.reason) || "join failed");
      return;
    }
    if (m.event === "broadcast") {
      const ev = (m.payload && (m.payload.event || (m.payload.payload && m.payload.payload.t))) || "";
      const pl = (m.payload && m.payload.payload) || {};
      handle(ev, pl);
    }
  }
  function handle(ev, pl) {
    if (!pl) return;
    if (ev === "hello" || ev === "pulse") {
      upsert(pl);
      emit("roster", MP.players);
      if (MP.host && !MP.started) send("roster", { players: MP.players, host: MP.id, code: MP.code });
      return;
    }
    if (ev === "roster") {
      if (Array.isArray(pl.players)) {
        pl.players.forEach(upsert);
        emit("roster", MP.players);
      }
      return;
    }
    if (ev === "go") {
      MP.started = true;
      MP.seed = pl.seed >>> 0;
      if (Array.isArray(pl.players)) pl.players.forEach(upsert);
      MP.players.forEach((p) => { p.alive = true; p.lifeT = 0; });
      emit("go", { seed: MP.seed, players: MP.players });
      return;
    }
    if (ev === "dead") {
      upsert({ id: pl.id, name: pl.name, alive: false, lifeT: pl.lifeT || 0, candles: pl.candles || 0 });
      emit("roster", MP.players);
      considerOver();
      return;
    }
    if (ev === "left") {
      MP.players = MP.players.filter((p) => p.id !== pl.id);
      emit("roster", MP.players);
      if (MP.started) considerOver();
    }
  }

  function joinSocket() {
    closeSocket();
    const url = DB_URL.replace(/^https:/, "wss:") + "/realtime/v1/websocket?apikey=" + encodeURIComponent(DB_KEY) + "&vsn=1.0.0";
    let ws;
    try { ws = new WebSocket(url); } catch (e) { emit("err", "no socket"); return; }
    MP.ws = ws;
    MP.joinRef = String(++MP.refN);
    ws.onopen = () => {
      push({
        topic: topic(),
        event: "phx_join",
        payload: {
          config: {
            broadcast: { ack: false, self: true },
            presence: { key: MP.id },
            postgres_changes: [],
            private: false
          },
          access_token: DB_KEY
        },
        ref: MP.joinRef,
        join_ref: MP.joinRef
      });
      setTimeout(() => {
        upsert({ id: MP.id, name: MP.name, host: MP.host, alive: true });
        send("hello", { id: MP.id, name: MP.name, host: MP.host, alive: true });
        emit("roster", MP.players);
      }, 180);
      clearInterval(MP.beat);
      MP.beat = setInterval(() => {
        push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++MP.refN) });
        if (MP.started) send("pulse", me());
        else send("hello", { id: MP.id, name: MP.name, host: MP.host, alive: true });
        const cut = Date.now() - 12000;
        MP.players.forEach((p) => {
          if (p.id !== MP.id && p.last && p.last < cut) {
            if (MP.started && p.alive !== false) { p.alive = false; considerOver(); }
          }
        });
        emit("roster", MP.players);
      }, 2000);
    };
    ws.onmessage = (e) => onMsg(e.data);
    ws.onerror = () => emit("err", "socket error");
    ws.onclose = () => {
      if (MP.code) setTimeout(() => { if (MP.code && (!MP.ws || MP.ws.readyState > 1)) joinSocket(); }, 1200);
    };
  }
  function closeSocket() {
    clearInterval(MP.beat);
    MP.beat = 0;
    try { if (MP.ws) MP.ws.close(); } catch (e) {}
    MP.ws = null;
  }

  function host() {
    MP.name = myName();
    MP.host = true;
    MP.started = false;
    MP.players = [];
    MP.code = rid(4);
    MP.seed = 0;
    upsert({ id: MP.id, name: MP.name, host: true, alive: true });
    joinSocket();
    emit("lobby", MP);
    return MP.code;
  }
  function join(code) {
    const c = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    if (c.length < 4) { emit("err", "bad code"); return false; }
    MP.name = myName();
    MP.host = false;
    MP.started = false;
    MP.players = [];
    MP.code = c;
    upsert({ id: MP.id, name: MP.name, host: false, alive: true });
    joinSocket();
    emit("lobby", MP);
    return true;
  }
  function start() {
    if (!MP.host || MP.started) return;
    if (MP.players.length < 2) { emit("err", "need 2"); return; }
    MP.seed = (Math.floor(Math.random() * 0x7fffffff) ^ Date.now()) >>> 0;
    if (!MP.seed) MP.seed = 1;
    MP.started = true;
    MP.players.forEach((p) => { p.alive = true; p.lifeT = 0; });
    send("go", { seed: MP.seed, players: MP.players.map((p) => ({ id: p.id, name: p.name })) });
    emit("go", { seed: MP.seed, players: MP.players });
  }
  function pulse(info) {
    if (!MP.started) return;
    upsert(Object.assign({ id: MP.id, name: MP.name, alive: true }, info || {}));
    send("pulse", Object.assign({ id: MP.id, name: MP.name, alive: true }, info || {}));
  }
  function dead(lifeT, candles) {
    upsert({ id: MP.id, name: MP.name, alive: false, lifeT: lifeT || 0, candles: candles || 0 });
    send("dead", { id: MP.id, name: MP.name, lifeT: lifeT || 0, candles: candles || 0 });
    considerOver();
  }
  function leave() {
    if (MP.code) send("left", { id: MP.id });
    MP.code = "";
    MP.started = false;
    MP.host = false;
    MP.players = [];
    closeSocket();
    emit("left");
  }

  window.ChoppyMP = {
    host, join, start, pulse, dead, leave,
    get: () => MP,
    setHandler: (fn) => { MP.on = fn; },
    players: () => MP.players.slice(),
    alive: aliveList,
    id: () => MP.id,
    code: () => MP.code
  };
})();
