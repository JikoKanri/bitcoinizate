(() => {
  const DB_URL = "https://xhewdrhfofwpzfogthai.supabase.co";
  const DB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXdkcmhmb2Z3cHpmb2d0aGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDM0OTMsImV4cCI6MjEwMjk3OTQ5M30.zch7bpyq2kaYaQeW4wMrQhkSPxyzzKKiD6jRLTWYidY";
  const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const MAX = 8;
  const DEFAULT_RULES = {
    cold: 0,
    msig: 0,
    bull: 42,
    bear: 26,
    laser: 11,
    swan: 21,
    muteTheme: false,
    muteSfx: false,
    muteVoice: false
  };

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
  function copyRules(src) {
    const r = Object.assign({}, DEFAULT_RULES, src || {});
    r.cold = Math.max(0, Math.min(99, r.cold | 0));
    r.msig = Math.max(0, Math.min(99, r.msig | 0));
    ["bull", "bear", "laser", "swan"].forEach((k) => {
      r[k] = Math.max(0, Math.min(100, Number(r[k]) || 0));
    });
    r.muteTheme = !!r.muteTheme;
    r.muteSfx = !!r.muteSfx;
    r.muteVoice = !!r.muteVoice;
    return r;
  }

  const MP = {
    id: rid(8),
    name: "P",
    code: "",
    host: false,
    seed: 0,
    started: false,
    ready: false,
    slot: 0,
    players: [],
    rules: copyRules(),
    startAt: 0,
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

  function assignSlots() {
    const host = MP.players.find((p) => p.host) || MP.players[0];
    const rest = MP.players.filter((p) => !host || p.id !== host.id)
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const ordered = host ? [host].concat(rest) : rest;
    ordered.forEach((p, i) => { p.slot = i; });
    const me = MP.players.find((p) => p.id === MP.id);
    if (me) MP.slot = me.slot || 0;
  }
  function upsert(p) {
    if (!p || !p.id) return false;
    const i = MP.players.findIndex((x) => x.id === p.id);
    if (i < 0) {
      if (MP.players.length >= MAX) return false;
      MP.players.push(Object.assign({
        alive: true, candles: 0, lifeT: 0, ready: false, slot: MP.players.length,
        x: 72, y: 280, v: 0, last: Date.now()
      }, p));
    } else {
      MP.players[i] = Object.assign({}, MP.players[i], p, { last: Date.now() });
    }
    assignSlots();
    return true;
  }
  function myUid() {
    try {
      if (window.choppyUid) return window.choppyUid;
      const s = JSON.parse(localStorage.getItem("bitcoinizate-sb") || "null");
      return (s && s.user && s.user.id) || null;
    } catch (e) { return null; }
  }
  function ident(extra) {
    return Object.assign({
      id: MP.id, name: MP.name, host: MP.host, uid: myUid(),
      ready: !!MP.ready, slot: MP.slot
    }, extra || {});
  }
  function aliveList() { return MP.players.filter((p) => p.alive !== false); }
  function allReady() {
    return MP.players.length >= 2 && MP.players.every((p) => !!p.ready);
  }
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
    if (ev === "hello" || ev === "pulse" || ev === "ready") {
      if (ev === "hello" && MP.host && !MP.started) {
        const known = MP.players.some((p) => p.id === pl.id);
        if (!known && MP.players.length >= MAX) {
          send("full", { id: pl.id });
          return;
        }
      }
      upsert(pl);
      emit("roster", MP.players);
      if (MP.host && !MP.started) {
        send("roster", { players: MP.players, host: MP.id, code: MP.code, rules: MP.rules });
      }
      return;
    }
    if (ev === "full") {
      if (pl.id === MP.id) {
        emit("err", "full");
        leave();
      }
      return;
    }
    if (ev === "rules") {
      if (pl && (pl.cold != null || pl.bull != null)) {
        MP.rules = copyRules(pl);
        emit("rules", MP.rules);
      }
      return;
    }
    if (ev === "roster") {
      if (Array.isArray(pl.players)) {
        pl.players.forEach(upsert);
        emit("roster", MP.players);
      }
      if (pl.rules) {
        MP.rules = copyRules(pl.rules);
        emit("rules", MP.rules);
      }
      return;
    }
    if (ev === "go") {
      MP.started = true;
      MP.seed = pl.seed >>> 0;
      MP.startAt = pl.startAt || (Date.now() + 3200);
      MP.sentAt = pl.sentAt || Date.now();
      if (pl.rules) MP.rules = copyRules(pl.rules);
      if (Array.isArray(pl.players)) pl.players.forEach(upsert);
      MP.players.forEach((p) => { p.alive = true; p.lifeT = 0; });
      assignSlots();
      emit("go", { seed: MP.seed, startAt: MP.startAt, sentAt: MP.sentAt, rules: MP.rules, players: MP.players });
      return;
    }
    if (ev === "reset") {
      MP.started = false;
      MP.ready = false;
      MP.startAt = 0;
      MP.players.forEach((p) => { p.ready = false; p.alive = true; p.lifeT = 0; });
      const me = MP.players.find((p) => p.id === MP.id);
      if (me) me.ready = false;
      if (pl && pl.rules) MP.rules = copyRules(pl.rules);
      assignSlots();
      emit("reset", MP);
      emit("roster", MP.players);
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
      assignSlots();
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
        upsert({ id: MP.id, name: MP.name, host: MP.host, alive: true, ready: MP.ready });
        send("hello", ident({ alive: true }));
        if (MP.host) send("rules", MP.rules);
        emit("roster", MP.players);
      }, 180);
      clearInterval(MP.beat);
      MP.beat = setInterval(() => {
        push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++MP.refN) });
        if (MP.started) send("pulse", ident({ alive: true }));
        else send("hello", ident({ alive: true, ready: MP.ready }));
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
    MP.ready = false;
    MP.slot = 0;
    MP.players = [];
    MP.code = rid(4);
    MP.seed = 0;
    MP.rules = copyRules();
    upsert(ident({ host: true, alive: true, ready: false }));
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
    MP.ready = false;
    MP.players = [];
    MP.code = c;
    MP.rules = copyRules();
    upsert(ident({ host: false, alive: true, ready: false }));
    joinSocket();
    emit("lobby", MP);
    return true;
  }
  function setReady(on) {
    MP.ready = !!on;
    const me = MP.players.find((p) => p.id === MP.id);
    if (me) me.ready = MP.ready;
    send("ready", ident({ ready: MP.ready }));
    emit("roster", MP.players);
  }
  function setRules(next) {
    if (!MP.host || MP.started) return;
    MP.rules = copyRules(next);
    send("rules", MP.rules);
    emit("rules", MP.rules);
  }
  function start() {
    if (!MP.host || MP.started) return;
    if (MP.players.length < 2) { emit("err", "need 2"); return; }
    if (MP.players.length > MAX) { emit("err", "full"); return; }
    if (!allReady()) { emit("err", "not ready"); return; }
    MP.seed = (Math.floor(Math.random() * 0x7fffffff) ^ Date.now()) >>> 0;
    if (!MP.seed) MP.seed = 1;
    MP.started = true;
    MP.startAt = Date.now() + 3200;
    const sentAt = Date.now();
    MP.players.forEach((p) => { p.alive = true; p.lifeT = 0; });
    assignSlots();
    send("go", {
      seed: MP.seed,
      startAt: MP.startAt,
      sentAt: sentAt,
      rules: MP.rules,
      players: MP.players.map((p) => ({
        id: p.id, name: p.name, uid: p.uid || null, slot: p.slot, host: !!p.host
      }))
    });
    emit("go", { seed: MP.seed, startAt: MP.startAt, sentAt: sentAt, rules: MP.rules, players: MP.players });
  }
  function pulse(info) {
    if (!MP.started) return;
    upsert(ident(Object.assign({ alive: true }, info || {})));
    send("pulse", ident(Object.assign({ alive: true }, info || {})));
  }
  function dead(lifeT, candles) {
    upsert(ident({ alive: false, lifeT: lifeT || 0, candles: candles || 0 }));
    send("dead", ident({ alive: false, lifeT: lifeT || 0, candles: candles || 0 }));
    considerOver();
  }
  function resetLobby() {
    MP.started = false;
    MP.ready = false;
    MP.startAt = 0;
    MP.players.forEach((p) => { p.ready = false; p.alive = true; p.lifeT = 0; });
    send("reset", { rules: MP.rules });
    emit("reset", MP);
    emit("roster", MP.players);
  }
  function leave() {
    if (MP.code) send("left", { id: MP.id });
    MP.code = "";
    MP.started = false;
    MP.host = false;
    MP.ready = false;
    MP.players = [];
    MP.rules = copyRules();
    closeSocket();
    emit("left");
  }

  window.ChoppyMP = {
    host, join, start, pulse, dead, leave, setReady, setRules, resetLobby,
    get: () => MP,
    setHandler: (fn) => { MP.on = fn; },
    players: () => MP.players.slice(),
    alive: aliveList,
    allReady,
    rules: () => copyRules(MP.rules),
    id: () => MP.id,
    code: () => MP.code,
    slot: () => MP.slot,
    MAX,
    DEFAULT_RULES
  };
})();
