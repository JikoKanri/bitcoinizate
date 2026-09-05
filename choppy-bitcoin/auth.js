(() => {
  const supabase = window.supabase && window.supabase.createClient
    ? window.supabase.createClient()
    : null;

  let currentUser = null;
  let currentProfile = null;
  let isSignUpMode = false;

  const AWARD_FALLBACK = [
    { id: "maxi", name: "Maxi Soul", why: "Never sold BTC — not by hand, not by A.I. bud." },
    { id: "halver", name: "Halving Catcher", why: "Every halving that spawned was eaten." },
    { id: "nocoiner", name: "Nocoiner", why: "Never bought BTC in that run." },
    { id: "greedy", name: "Greedy Miner", why: "Ate 0 halvings." },
    { id: "opsec", name: "Opsec Warrior", why: "Lost 0 cold storage." },
    { id: "paper", name: "Paper Hands", why: "Sold BTC in a bear market." }
  ];
  function awardHtmlLocal() {
    if (window.choppyAwardHtml) return window.choppyAwardHtml();
    let owned = {};
    try {
      const bag = JSON.parse(localStorage.getItem("choppy-awards") || "{}");
      owned = bag[window.choppyUserId || "guest"] || {};
    } catch (e) {}
    return AWARD_FALLBACK.map((a) => {
      const on = !!owned[a.id];
      return "<p class=\"" + (on ? "aw-on" : "aw-off") + "\"><b>" + (on ? "✓ " : "○ ") + a.name + "</b> — " + a.why + "</p>";
    }).join("");
  }
  function openModal(el) {
    if (!el) return;
    el.classList.add("open");
    el.classList.remove("hide");
    el.hidden = false;
    el.style.setProperty("display", "flex", "important");
    el.style.setProperty("pointer-events", "auto", "important");
    el.style.zIndex = "9999";
  }
  function closeModal(el) {
    if (!el) return;
    el.classList.remove("open");
    el.classList.add("hide");
    el.hidden = true;
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("pointer-events", "none", "important");
  }
  const authMsg = $("auth-msg");

  function setMsg(text, bad) {
    if (!authMsg) return;
    authMsg.textContent = text || "";
    authMsg.classList.toggle("bad", !!bad);
  }

  function validAlias(s) {
    return /^[a-zA-Z0-9_]{3,16}$/.test(s);
  }

  function fmtScoreBtc(sats) {
    const btc = (Number(sats) || 0) / 1e4;
    if (btc >= 1) return btc.toFixed(4) + " BTC";
    if (btc >= 0.0001) return btc.toFixed(6) + " BTC";
    return btc.toFixed(8) + " BTC";
  }

  function aliasReady(profile) {
    if (!profile || !profile.alias_changed_at) return true;
    const t = Date.parse(profile.alias_changed_at);
    if (!t) return true;
    return Date.now() - t >= 30 * 24 * 3600 * 1000;
  }

  function aliasNextDate(profile) {
    const t = Date.parse(profile && profile.alias_changed_at);
    if (!t) return "";
    return new Date(t + 30 * 24 * 3600 * 1000).toLocaleDateString();
  }

  function updateAuthUI(profile) {
    const btn = $("btn-show-auth");
    const tag = $("user-profile-tag");
    if (profile && profile.username) {
      if (btn) btn.classList.add("hide");
      if (tag) {
        tag.classList.remove("hide");
        tag.textContent = "@" + profile.username;
      }
    } else {
      if (btn) btn.classList.remove("hide");
      if (tag) {
        tag.classList.add("hide");
        tag.textContent = "";
      }
    }
    fetchGlobalLeaderboard();
  }

  async function checkActiveSession() {
    if (!supabase) { updateAuthUI(null); return; }
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      currentUser = null; currentProfile = null;
      updateAuthUI(null);
      return;
    }
    currentUser = data.session.user || { id: "" };
    window.choppyUserId = currentUser.id || "";
    const rec = /[?&#]type=recovery\b/.test(location.hash + location.search);
    await loadUserProfile();
    if (rec) openReset();
    else closeModal(authModal);
  }

  function loadType() {
    try {
      const s = JSON.parse(localStorage.getItem("bitcoinizate-sb") || "null");
      return s && s.type === "recovery";
    } catch (e) { return false; }
  }

  async function sendReset() {
    const email = ($("auth-email") && $("auth-email").value || "").trim();
    if (!email) { setMsg("Enter your email first.", true); return; }
    if (!supabase) { setMsg("Auth is offline.", true); return; }
    setMsg("Sending reset mail…");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin + "/choppy-bitcoin/"
    });
    if (error) setMsg(error.message || "Could not send mail.", true);
    else setMsg("If that inbox exists, a reset link is on the way.");
  }

  function openReset() {
    if ($("modal-auth-title")) $("modal-auth-title").textContent = "New password";
    if ($("group-alias")) $("group-alias").classList.add("hide");
    const emailLab = $("auth-email") && $("auth-email").closest("label");
    if (emailLab) emailLab.classList.add("hide");
    if ($("group-pass2")) $("group-pass2").classList.remove("hide");
    if ($("auth-password")) {
      $("auth-password").value = "";
      $("auth-password").autocomplete = "new-password";
    }
    if ($("auth-password2")) $("auth-password2").value = "";
    if ($("btn-submit-auth")) {
      $("btn-submit-auth").textContent = "Save password";
      $("btn-submit-auth").dataset.reset = "1";
    }
    if ($("btn-forgot")) $("btn-forgot").classList.add("hide");
    if ($("btn-toggle-auth")) $("btn-toggle-auth").classList.add("hide");
    if (authModal) openModal(authModal);
    setMsg("Choose a new password.");
  }

  function showSignFields() {
    const emailLab = $("auth-email") && $("auth-email").closest("label");
    if (emailLab) emailLab.classList.remove("hide");
    if ($("group-pass2")) $("group-pass2").classList.add("hide");
    if ($("auth-password")) $("auth-password").autocomplete = "current-password";
    if ($("btn-forgot")) $("btn-forgot").classList.remove("hide");
    if ($("btn-toggle-auth")) $("btn-toggle-auth").classList.remove("hide");
    if ($("btn-submit-auth")) delete $("btn-submit-auth").dataset.reset;
  }

  async function saveNewPassword() {
    const password = ($("auth-password") && $("auth-password").value || "").trim();
    const again = ($("auth-password2") && $("auth-password2").value || "").trim();
    if (password.length < 8) { setMsg("Password must be at least 8 characters.", true); return; }
    if (password !== again) { setMsg("Passwords do not match.", true); return; }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setMsg(error.message || "Could not update password.", true); return; }
    try {
      const s = JSON.parse(localStorage.getItem("bitcoinizate-sb") || "null");
      if (s) { delete s.type; localStorage.setItem("bitcoinizate-sb", JSON.stringify(s)); }
    } catch (e) {}
    if ($("btn-submit-auth")) delete $("btn-submit-auth").dataset.reset;
    showSignFields();
    setMsg("Password saved. You are signed in.");
    await checkActiveSession();
  }

  async function loadUserProfile() {
    if (!currentUser || !supabase) return;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single();
    if (error || !data) {
      currentProfile = {
        id: currentUser.id,
        username: (currentUser.user_metadata && currentUser.user_metadata.username) || "trader",
        highscore: 0
      };
      updateAuthUI(currentProfile);
      return;
    }
    currentProfile = data;
    window.choppyUserId = currentUser.id || "";
    if (Array.isArray(data.awards) && window.mergeChoppyAwards) window.mergeChoppyAwards(data.awards);
    updateAuthUI(currentProfile);
  }

  async function handleAuthSubmit() {
    if ($("arcade-honeypot") && $("arcade-honeypot").value) {
      if (authModal) closeModal(authModal);
      return;
    }
    const email = ($("auth-email") && $("auth-email").value || "").trim();
    const password = ($("auth-password") && $("auth-password").value || "").trim();
    const username = ($("auth-username") && $("auth-username").value || "").trim();
    if (!email || !password) { setMsg("Enter email and password.", true); return; }
    if (password.length < 8) { setMsg("Password must be at least 8 characters.", true); return; }
    if (!supabase) { setMsg("Auth is offline.", true); return; }
    setMsg("Working…");
    try {
      if (isSignUpMode) {
        if (!validAlias(username)) { setMsg("Alias: 3–16 letters, numbers or _.", true); return; }
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { data: { username } }
        });
        if (error) throw error;
        if (data.session && data.user) {
          currentUser = data.user;
          try {
            await supabase.from("profiles").insert([{ id: data.user.id, username, highscore: 0 }]);
          } catch (e) {}
          await loadUserProfile();
          if (authModal) closeModal(authModal);
          setMsg("");
        } else {
          setMsg("Check your email to confirm the account.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        currentUser = data.user;
        await loadUserProfile();
        if (authModal) closeModal(authModal);
        setMsg("");
      }
    } catch (e) {
      setMsg(e.message || "Authentication failed.", true);
    }
  }

  async function updateProfileAddresses() {
    if (!currentUser || !supabase) return;
    const btcAddr = ($("profile-btc-addr") && $("profile-btc-addr").value || "").trim();
    const lnAddr = ($("profile-ln-addr") && $("profile-ln-addr").value || "").trim();
    const aliasEl = $("profile-alias");
    const nextAlias = aliasEl ? aliasEl.value.trim() : "";
    const patch = { btc_address: btcAddr, ln_address: lnAddr };
    if (nextAlias && currentProfile && nextAlias !== currentProfile.username) {
      if (!validAlias(nextAlias)) { setMsg("Alias: 3–16 letters, numbers or _.", true); return; }
      if (!aliasReady(currentProfile)) {
        setMsg(((window.BZ && BZ.t("aliasWait")) || "Wait until ") + aliasNextDate(currentProfile), true);
        return;
      }
      patch.username = nextAlias;
      patch.alias_changed_at = new Date().toISOString();
    }
    try {
      await supabase.from("profiles").update(patch).eq("id", currentUser.id);
      await loadUserProfile();
      if (profileModal) closeModal(profileModal);
    } catch (e) {
      setMsg("Update failed: " + (e.message || "error"), true);
    }
  }

  async function fetchGlobalLeaderboard(targetId) {
    const box = $(targetId || "leaderboard-box") || $("site-board");
    if (!box || !supabase) return;
    try {
      let rows = [];
      await supabase.from("profiles").select("username, highscore").order("highscore", { ascending: false }).limit(10).then((res) => {
        if (res.error) throw res.error;
        rows = res.data || [];
      });
      if (!rows.length) { box.textContent = "—"; return; }
      box.textContent = rows.map((row, i) => (i + 1) + ". @" + (row.username || "?") + "   " + fmtScoreBtc(row.highscore)).join("\n");
    } catch (e) {
      box.textContent = "—";
    }
  }

  async function submitNewHighScore(n, meta) {
    if (!currentUser || !currentProfile || !supabase) return;
    const next = Number(n) || 0;
    if (next <= 0 || !isFinite(next)) return;
    if (next > 21e6 * 250000) return;
    const life = meta && Number(meta.lifeT) || 0;
    const candles = meta && Number(meta.candles) || 0;
    if (life < 12 || candles < 3) return;
    if (meta && meta.human === false) return;
    const old = Number(currentProfile.highscore != null ? currentProfile.highscore : currentProfile.high_score) || 0;
    if (next <= old) return;
    try {
      const { error } = await supabase.rpc("submit_choppy_score", {
        p_score: next,
        p_life: life,
        p_candles: candles
      });
      if (error) return;
      await loadUserProfile();
    } catch (e) {}
  }

  function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    showSignFields();
    const title = $("modal-auth-title");
    const group = $("group-alias");
    if (title) title.textContent = isSignUpMode ? ((window.BZ && BZ.t("signUp")) || "Sign up") : ((window.BZ && BZ.t("signIn")) || "Sign in");
    if (group) group.classList.toggle("hide", !isSignUpMode);
    if ($("btn-submit-auth")) $("btn-submit-auth").textContent = isSignUpMode ? "Create account" : "Sign in";
    if ($("btn-toggle-auth")) $("btn-toggle-auth").textContent = isSignUpMode ? "Have an account?" : "Need an account?";
    setMsg("");
  }

  function openAuth() {
    isSignUpMode = false;
    showSignFields();
    if ($("modal-auth-title")) $("modal-auth-title").textContent = "Sign in";
    if ($("group-alias")) $("group-alias").classList.add("hide");
    if ($("btn-submit-auth")) $("btn-submit-auth").textContent = "Sign in";
    if ($("btn-toggle-auth")) $("btn-toggle-auth").textContent = "Need an account?";
    setMsg("");
    if (authModal) openModal(authModal);
  }

  window.openAuth = openAuth;
  window.closeAuth = () => closeModal(authModal);
  document.addEventListener("click", (e) => {
    const btn = e.target.closest && e.target.closest("#btn-show-auth, #overlay-auth");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    openAuth();
  }, true);
  if ($("btn-close-auth")) $("btn-close-auth").onclick = () => authModal && closeModal(authModal);
  if ($("btn-toggle-auth")) $("btn-toggle-auth").onclick = toggleAuthMode;
  if ($("btn-submit-auth")) $("btn-submit-auth").onclick = () => {
    if ($("btn-submit-auth").dataset.reset === "1") saveNewPassword();
    else handleAuthSubmit();
  };
  if ($("btn-forgot")) $("btn-forgot").onclick = (e) => { e.preventDefault(); sendReset(); };
  ["auth-email", "auth-password", "auth-username", "auth-password2"].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      if ($("btn-submit-auth") && $("btn-submit-auth").dataset.reset === "1") saveNewPassword();
      else handleAuthSubmit();
    });
  });

  if ($("user-profile-tag")) {
    $("user-profile-tag").onclick = () => {
      if (!currentProfile) return;
      if ($("profile-score-info")) $("profile-score-info").textContent = ((window.BZ && BZ.t("highScore")) || "High score") + "  " + fmtScoreBtc(currentProfile.highscore != null ? currentProfile.highscore : currentProfile.high_score);
      if ($("profile-alias")) {
        $("profile-alias").value = currentProfile.username || "";
        $("profile-alias").disabled = !aliasReady(currentProfile);
      }
      if ($("alias-hint")) {
        $("alias-hint").textContent = aliasReady(currentProfile)
          ? ((window.BZ && BZ.t("aliasMonth")) || "")
          : ((window.BZ && BZ.t("aliasWait")) || "") + aliasNextDate(currentProfile);
      }
      if ($("profile-btc-addr")) $("profile-btc-addr").value = currentProfile.btc_address || "";
      if ($("profile-ln-addr")) $("profile-ln-addr").value = currentProfile.ln_address || "";
      const box = $("profile-awards");
      if (box) box.innerHTML = awardHtmlLocal();
      if (profileModal) openModal(profileModal);
    };
  }
  if ($("btn-close-profile")) $("btn-close-profile").onclick = () => profileModal && closeModal(profileModal);
  if (profileModal) profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) closeModal(profileModal);
  });
  if (authModal) authModal.addEventListener("click", (e) => {
    if (e.target === authModal) closeModal(authModal);
  });
  if ($("btn-save-profile")) $("btn-save-profile").onclick = updateProfileAddresses;
  if ($("btn-logout")) {
    $("btn-logout").onclick = async () => {
      if (supabase) await supabase.auth.signOut();
      currentUser = null; currentProfile = null;
      window.choppyUserId = "";
      updateAuthUI(null);
      if (profileModal) closeModal(profileModal);
    };
  }

  window.persistAwards = async function (ids) {
    if (!currentUser || !supabase || !ids) return;
    try {
      await supabase.from("profiles").update({ awards: ids }).eq("id", currentUser.id);
    } catch (e) {}
  };
  window.submitNewHighScore = submitNewHighScore;
  window.sendFeedback = async function (text) {
    const msg = String(text || "").trim();
    if (msg.length < 8 || msg.length > 2000) return false;
    try {
      const last = Number(localStorage.getItem("choppy-feed-at") || 0);
      if (Date.now() - last < 60000) return false;
    } catch (e) {}
    try {
      if (!supabase || !supabase.rpc) return false;
      const { error } = await supabase.rpc("submit_feedback", { p_message: msg.slice(0, 2000) });
      if (error) return false;
      try { localStorage.setItem("choppy-feed-at", String(Date.now())); } catch (e) {}
      return true;
    } catch (e) {
      return false;
    }
  };
  window.refreshLeaderboard = fetchGlobalLeaderboard;
  window.openSignUp = function () {
    openAuth();
    if (!isSignUpMode) toggleAuthMode();
  };
  const cta = $("cta-signup");
  if (cta) cta.onclick = () => window.openSignUp();
  window.addEventListener("DOMContentLoaded", checkActiveSession);
  closeModal(authModal);
  closeModal(profileModal);
  checkActiveSession();
})();
